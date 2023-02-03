/*** callback fns for CRUD operations ***/

/* require bcrypt */
const bcrypt = require("bcrypt");

/* require all needed modules */
const PatientSchema = require("../Models/patientModel");
const emailSchema = require("../Models/emailModel");
/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

// Add a new patient
exports.addPatient = async (request, response, next) => {
  try {
    const hash = await bcrypt.hash(request.body.password, 10);
    let testEmail = await emailSchema.findOne({ email: request.body.email });
    if (testEmail) {
      return response.status(400).json({ message: `Email Already in use` });
    } else {
      let email = new emailSchema({ email: request.body.email });
      await email.save();
    }
    const patient = new PatientSchema({
      ...request.body,
      password: hash,
    });
    await patient.save();
    response
      .status(201)
      .json({ message: "Patient created successfully.", patient });
  } catch (error) {
    next(error);
  }
};

// Edit a patient
exports.editPatient = async (request, response, next) => {
  try {
    const patient = await PatientSchema.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    );
    response
      .status(200)
      .json({ message: "Patient updated successfully.", patient });
  } catch (error) {
    next(error);
  }
};

// Remove a patient
exports.removePatient = async (request, response, next) => {
  try {
    const patient = await PatientSchema.findByIdAndDelete(
      request.params.id || request.body.id
    );
    if (!patient) {
      return next(new Error("patient not found"));
    }
    response
      .status(201)
      .json({ message: "Patient removed successfully.", patient });
  } catch (error) {
    next(error);
  }
};

//get all patients
exports.getPatients = async (request, response, next) => {
  try {
    let patients = await filterData(PatientSchema, request.query);
    patients = sortData(patients, request.query);
    patients = paginateData(patients, request.query);
    patients = sliceData(patients, request.query);

    response.status(200).json({ patients });
  } catch (error) {
    next(error);
  }
};

// Get a patient by ID
exports.getPatientById = async (request, response, next) => {
  try {
    const patient = await PatientSchema.findById(request.params.id);
    if (!patient) {
      return next(new Error("patient not found"));
    }
    response.status(200).json({ patient });
  } catch (error) {
    next(error);
  }
};
