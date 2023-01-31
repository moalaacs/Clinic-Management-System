/*** callback fns for CRUD operations ***/

/* require bcrypt */
const bcrypt = require("bcrypt");

/* require all needed modules */
const doctorSchema = require("../Models/doctorModel");

exports.getAllDoctors = async (request, response, next) => {
  try {
    let resultData = await doctorSchema.find();
    response.status(200).json(resultData);
  } catch (error) {
    next(error);
  }
}; //Doctor

exports.addDoctor = async (request, response, next) => {
  const hash = await bcrypt.hash(request.body.password, 10);
  let addedDoctor = doctorSchema({
    name: request.body.name,
    specilization: request.body.specilization,
    mobileNumber: request.body.phone,
    schedule: request.body.schedule,
    clinic: request.body.clinic,
    email: request.body.email,
    password: hash,
    image: request.body.image,
    address: request.body.address,
  });
  try {
    let resultData = await addedDoctor.save();
    response.status(200).json({ status: "Added" });
  } catch (error) {
    next(error);
  }
}; //Doctor

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
}; //Doctor/:id

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
      { __id: request.params.id },
      { $set: tempDoctor }
    );
    response.status(200).json("Patch Succesfully");
  } catch (error) {
    next(error);
  }
}; //Doctor/:id

exports.getDoctorById = async (request, response, next) => {
  try {
    let resultData = await doctorSchema.find({ _id: request.params.id });
    response.status(200).json(resultData);
  } catch (error) {
    next(error);
  }
}; //Doctor/:id

exports.removeDoctorById = async (request, response, next) => {
  try {
    let resultData = await doctorSchema.deleteOne({ _id: request.params.id });
    response.status(200).json("Deleted");
  } catch (error) {
    next(error);
  }
}; //Doctor/:id
