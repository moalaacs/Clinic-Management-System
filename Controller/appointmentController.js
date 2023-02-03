/*** callback fns for CRUD operations ***/

/* require bcrypt */
const bcrypt = require("bcrypt");

/* require all needed modules */
const appointmentSchema = require("../Models/appointmentModel");
const doctorModel = require("../Models/doctorModel");
const patientModel = require("../Models/patientModel");
const clinicModel = require("../Models/clinicModel");
/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

// Add a new Appointment
exports.addAppointment = async (request, response, next) => {
  try {
    const { doctorId, patientId, date, time, clinicId } = request.body;

    const clinic = await clinicModel.findById(clinicId);
    if (!clinic) {
      return response.status(400).json({ message: "Clinic not found." });
    }

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return response.status(400).json({ message: "Doctor not found." });
    }
    const patient = await patientModel.findById(patientId);
    if (!patient) {
      return response.status(400).json({ message: "Patient not found." });
    }

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    const timeRegex = /^\d{2}:\d{2}$/;

    if (!date.match(dateRegex)) {
      return response
        .status(400)
        .json({ message: "Invalid date format, expected DD/MM/YYYY." });
    }

    const minutes = time.split(":")[1];
    if (!time.match(timeRegex) || (minutes !== "00" && minutes !== "30")) {
      return response
        .status(400)
        .json({ message: "Invalid time format, expected HH:00 or HH:30." });
    }

    const appointmentDate = new Date(`${date} ${time}:00`);
    if (appointmentDate < new Date()) {
      return response
        .status(400)
        .json({ message: "Appointment date must be in the future." });
    }

    const _id = new Date().getTime();

    const existingAppointment = await appointmentSchema.findOne({
      doctorId,
      date,
      time,
    });
    if (existingAppointment) {
      return response
        .status(400)
        .json({ message: "Doctor already has an appointment at this time." });
    }

    const appointment = new appointmentSchema({
      _id,
      doctorId,
      patientId,
      date,
      time,
      clinicId,
    });
    await appointment.save();

    response
      .status(201)
      .json({ message: "Appointment created successfully.", appointment });
  } catch (error) {
    next(error);
  }
};

// Edit appointment
exports.editAppointment = async (request, response, next) => {
  try {
    const appointmentId = request.params.id;
    let { doctorId, patientId, date, time } = request.body;

    const existingAppointment = await appointmentSchema.findById(appointmentId);
    if (!existingAppointment) {
      return response.status(400).json({ message: "Appointment not found." });
    }

    c;

    if (doctorId) {
      const doctor = await doctorModel.findById(doctorId);
      if (!doctor) {
        return response.status(400).json({ message: "Doctor not found." });
      }
    } else {
      doctorId = existingAppointment.doctorId;
    }

    if (patientId) {
      const patient = await patientModel.findById(patientId);
      if (!patient) {
        return response.status(400).json({ message: "Patient not found." });
      }
    } else {
      patientId = existingAppointment.patientId;
    }

    if (date) {
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!date.match(dateRegex)) {
        return response.status(400).json({ message: "Invalid date format." });
      }
    } else {
      date = existingAppointment.date;
    }

    if (time) {
      const timeRegex = /^\d{2}:\d{2}$/;
      const minutes = time.split(":")[1];
      if (!time.match(timeRegex) || (minutes !== "00" && minutes !== "30")) {
        return response.status(400).json({ message: "Invalid time format." });
      }
    } else {
      time = existingAppointment.time;
    }

    const appointmentDate = new Date(`${date} ${time}:00`);
    if (appointmentDate < new Date()) {
      return response
        .status(400)
        .json({ message: "Appointment date must be in the future." });
    }

    const validateAppointment = await appointmentSchema.findOne({
      doctorId,
      date,
      time,
    });
    if (validateAppointment && validateAppointment._id != appointmentId) {
      return response
        .status(400)
        .json({ message: "Doctor already has an appointment at that time." });
    }

    // // Update appointment
    // const updatedAppointment = await appointmentSchema.findOneAndUpdate(
    //   { _id: appointmentId },
    //   { $set: { doctorId, patientId, date, time } },
    //   { new: true }
    // );

    const updatedAppointment = await appointmentSchema.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    );
    response.status(200).json({
      message: "Appointment updated successfully.",
      updatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

// Remove appointment
exports.removeAppointment = async (request, response, next) => {
  try {
    const appointment = await appointmentSchema.findByIdAndRemove(
      request.params.id
    );
    if (!appointment) {
      return response.status(400).json({ message: "Appointment not found." });
    }
    response.status(200).json({ message: "Appointment removed." });
  } catch (error) {
    next(error);
  }
};

// Get all appointments
exports.getAppointments = async (request, response, next) => {
  try {
    let appointments = await filterData(appointmentSchema, request.query);
    appointments = sortData(appointments, request.query);
    appointments = paginateData(appointments, request.query);
    appointments = sliceData(appointments, request.query);

    response.status(200).json({ appointments });
  } catch (error) {
    next(error);
  }
};

// Get a appointment by ID
exports.getAppointmentById = async (request, response, next) => {
  try {
    const appointment = await appointmentSchema.findById(request.params.id);
    if (!appointment) {
      return response.status(400).json({ message: "Appointment not found." });
    }
    response.status(200).json({ appointment });
  } catch (error) {
    next(error);
  }
};
