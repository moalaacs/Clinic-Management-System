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
const { request, response } = require("express");

// Add a new Appointment
exports.addAppointment = async (request, response, next) => {
  try {
    const { doctorId, patientId, date, time, clinicId } = request.body;

    const clinic = await clinicModel.findById(clinicId);
    if (!clinic) {
      return response
        .status(400)
        .json({ message: `Clinic ${clinicId} not found.` });
    }

    let doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return response.status(400).json({ message: "Doctor not found." });
    }
    const patient = await patientModel.findById(patientId);
    if (!patient) {
      return response.status(400).json({ message: "Patient not found." });
    }

    // const timeRegex = /^\d{2}:\d{2}$/;

    const minutes = time.split(":")[1];
    if (minutes !== "00" && minutes !== "30") {
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
      _date: date,
      _time: time,
    });
    if (existingAppointment) {
      return response
        .status(400)
        .json({ message: "Doctor already has an appointment at this time." });
    }

    const appointment = new appointmentSchema({
      _id,
      _date: date,
      _time: time,
      _doctorId: doctorId,
      _patientId: patientId,
      _clinicId: clinicId,
    });
    await appointment.save();

    const newAppointmentForDoctor = {
      _date: date,
      _time: time,
      _clinicId: clinicId,
      _patientId: patientId,
    };
    doctor._appointments.push(newAppointmentForDoctor);

    await doctor.save();

    response
      .status(201)
      .json({ message: "Appointment created successfully.", appointment });
  } catch (error) {
    next(error);
  }
};

// Patch appointment
exports.patchAppointment = async (request, response, next) => {
  try {
    const appointmentId = request.params.id;
    let { doctorId, patientId, date, time } = request.body;

    const existingAppointment = await appointmentSchema.findById(appointmentId);
    if (!existingAppointment) {
      return response.status(400).json({ message: "Appointment not found." });
    }

    if (doctorId) {
      const doctor = await doctorModel.findById(doctorId);
      if (!doctor) {
        return response.status(400).json({ message: "Doctor not found." });
      }
    } else {
      doctorId = existingAppointment._doctorId;
    }

    if (patientId) {
      const patient = await patientModel.findById(patientId);
      if (!patient) {
        return response.status(400).json({ message: "Patient not found." });
      }
    } else {
      patientId = existingAppointment._patientId;
    }

    if (date) {
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!date.match(dateRegex)) {
        return response.status(400).json({ message: "Invalid date format." });
      }
    } else {
      date = existingAppointment._date;
    }

    if (time) {
      const minutes = time.split(":")[1];
      if (minutes !== "00" && minutes !== "30") {
        return response.status(400).json({ message: "Invalid time format." });
      }
    } else {
      time = existingAppointment._time;
    }

    const appointmentDate = new Date(`${date} ${time}:00`);
    if (appointmentDate < new Date()) {
      return response
        .status(400)
        .json({ message: "Appointment date must be in the future." });
    }
    let tempAppointment = {
      _doctorId: doctorId,
      _patientId: patientId,
      _date: date,
      _time: time,
    };
    const validateAppointment = await appointmentSchema.findOne({
      _doctorId: doctorId,
      _date: date,
      _time: time,
    });
    if (validateAppointment && validateAppointment._id != appointmentId) {
      return response
        .status(400)
        .json({ message: "Doctor already has an appointment at that time." });
    }
    const updatedAppointment = await appointmentSchema.updateOne(
      { _id: request.params.id },
      { $set: tempAppointment }
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
exports.removeAppointmentById = async (request, response, next) => {
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
exports.getAllAppointments = async (request, response, next) => {
  try {
    let query = reqNamesToSchemaNames(request.query);
    let appointments = await filterData(appointmentSchema, query, [
      { path: "_doctorId", options: { strictPopulate: false } },
      { path: "_patientId", options: { strictPopulate: false } },
      { path: "_clinicId", options: { strictPopulate: false } },
    ]);
    appointments = sortData(appointments, query);
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

// All Appointments Reports
exports.allAppointmentsReports = (request, response, next) => {
  appointmentSchema
    .find()
    .populate({ path: "_patientId", select: { _id: 0 } })
    .populate({ path: "_doctorId", select: { _id: 0 } })
    .populate({ path: "_clinicId", select: { _id: 0 } })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

// Appointments Daily Reports
exports.dailyAppointmentsReports = (request, response, next) => {
  let date = new Date();
  date.setHours(0, 0, 0);
  let day = 60 * 60 * 24 * 1000;
  let nextDay = new Date(date.getTime() + day);
  appointmentSchema
    .find()
    // .where("date".gt(date).lt(nextDay))
    .populate({ path: "_patientId", select: { _id: 0 } })
    .populate({
      path: "_doctorId",
      select: { _id: 0, appointmentNo: 0, workingHours: 0 },
    })
    .populate({ path: "_clinicId", select: { _id: 0 } })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

// Patient Appointments
exports.patientAppointmentsReports = (request, response, next) => {
  appointmentSchema
    .find({ patientID: request.params.id })
    .populate({ path: "_patientId", select: { _id: 0 } })
    .populate({ path: "_doctorId", select: { _id: 0 } })
    .populate({ path: "_clinicId", select: { _id: 0 } })
    .then((data) => {
      request.status(200).json(data);
    })
    .catch((error) => next(error));
};

const reqNamesToSchemaNames = (query) => {
  const fieldsToReplace = {
    id: "_id",
    date: "_date",
    time: "_time",
    doctorId: "_doctorId",
    patientId: "_patientId",
    clinicId: "_clinicId",
  };

  const replacedQuery = {};
  for (const key in query) {
    let newKey = key;
    for (const replaceKey in fieldsToReplace) {
      if (key.includes(replaceKey)) {
        newKey = key.replace(replaceKey, fieldsToReplace[replaceKey]);
        break;
      }
    }
    replacedQuery[newKey] = query[key];
  }
  return replacedQuery;
};
