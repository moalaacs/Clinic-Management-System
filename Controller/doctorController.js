/*** callback fns for CRUD operations ***/

/* Clinic Schema */
const clinicSchema = require("../Models/clinicModel");

/* require bcrypt */
const bcrypt = require("bcrypt");

/* require all needed modules */
const doctorSchema = require("../Models/doctorModel");

/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

exports.getAllDoctors = async (request, response, next) => {
  try {
    let doctors = await filterData(doctorSchema, request.query);
    doctors = sortData(doctors, request.query);
    doctors = paginateData(doctors, request.query);
    doctors = sliceData(doctors, request.query);
    response.status(200).json({ doctors });
  } catch (error) {
    next(error);
  }
};

exports.addDoctor = async (request, response, next) => {
  try {
    const existingClinics = await clinicSchema.find({}, { id: 1 });
    const sentClinics = request.body.clinic;
    sentClinics.forEach((sntClinic) => {
      if (!existingClinics.find((extClinic) => extClinic._id == sntClinic)) {
        return response
          .status(400)
          .json({ message: `No such clinic record for id: ${sntClinic}` });
      }
    });
    const hash = await bcrypt.hash(request.body.password, 10);
    const doctor = new doctorSchema({
      ...request.body,
      password: hash,
    });
    await doctor.save();
    response
      .status(201)
      .json({ message: "Doctor created successfully.", doctor });
  } catch (error) {
    next(error);
  }
};

exports.updateDoctorById = async (request, response, next) => {
  try {
    let updatedDoctor = await doctorSchema.updateOne(
      { _id: request.params.id },
      {
        $set: {
          name: request.body.name,
          specilization: request.body.specilization,
          mobileNumber: request.body.phone,
          schedule: request.body.schedule,
          clinic: request.body.clinic,
          email: request.body.email,
          password: request.body.password,
          image: request.body.image,
          address: request.body.address,
        },
      }
    );
    response.status(200).json({ status: "Updated", updatedDoctor });
  } catch (error) {
    next(error);
  }
}; //PUT

exports.patchDoctorById = async (request, response, next) => {
  let tempDoctor = {};
  if (request.body.name != null) {
    tempDoctor.name = request.body.name;
  }
  if (request.body.specilization != null) {
    tempDoctor.specilization = request.body.specilization;
  }
  if (request.body.phone != null) {
    tempDoctor.mobileNumber = request.body.phone;
  }
  if (request.body.employees != null) {
    tempDoctor.employees = request.body.employees;
  }
  if (request.body.schedule != null) {
    tempDoctor.schedule = request.body.schedule;
  }
  if (request.body.clinic != null) {
    tempDoctor.clinic = request.body.clinic;
  }
  if (request.body.email != null) {
    tempDoctor.email = request.body.email;
  }
  if (request.body.password != null) {
    const hash = await bcrypt.hash(request.body.password, 10);
    tempDoctor.password = hash;
  }
  if (request.body.image != null) {
    tempDoctor.image = request.body.image;
  }
  if (request.body.address != null) {
    tempDoctor.address = request.body.address;
  }
  try {
    let updatedDoctor = await doctorSchema.updateOne(
      { _id: request.params.id },
      { $set: tempDoctor }
    );
    response.status(200).json("Patch Succesfully");
  } catch (error) {
    next(error);
  }
};

exports.getDoctorById = async (request, response, next) => {
  try {
    let doctor = await doctorSchema.find({ _id: request.params.id });
    if (!doctor) {
      return next(new Error("doctor not found"));
    }
    response.status(200).json(doctor);
  } catch (error) {
    next(error);
  }
};

exports.removeDoctorById = async (request, response, next) => {
  try {
    let doctor = await doctorSchema.deleteOne({ _id: request.params.id });
    if (!doctor) response.status(200).json("Doctor not found");
    response.status(200).json("Deleted");
  } catch (error) {
    next(error);
  }
};
