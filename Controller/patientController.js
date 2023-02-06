/*** callback fns for CRUD operations ***/

/* require bcrypt */
const bcrypt = require("bcrypt");

/* require all needed modules */
const patientSchema = require("../Models/patientModel");
const emailSchema = require("../Models/emailModel");
/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

//get all patients
exports.getAllPatients = async (request, response, next) => {
  try {
    let patients = await filterData(patientSchema, request.query);
    patients = sortData(patients, request.query);
    patients = paginateData(patients, request.query);
    patients = sliceData(patients, request.query);

    response.status(200).json({ patients });
  } catch (error) {
    next(error);
  }
};

// Add a new patient
exports.addPatient = async (request, response, next) => {
  try {
    const hash = await bcrypt.hash(request.body.password, 10);
    let testEmail = await emailSchema.findOne({ _email: request.body.email });
    if (testEmail) {
      return response.status(400).json({ message: `Email Already in use` });
    } else {
      let email = new emailSchema({ _email: request.body.email });
      await email.save();
    }
    const patient = new patientSchema({
      _fname: request.body.firstname,
      _lname: request.body.lastname,
      _age: request.body.age,
      _gender: request.body.gender,
      _contactNumber: request.body.phone,
      _email: request.body.email,
      _address: request.body.address,
      _password: hash,
      _image: request.body.profileImage,
      _medicalHistory: request.body.medicalHistory,
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

// Put a patient
exports.putPatientById = async (request, response, next) => {
  let tempPatient = {
    _fname: request.body.firstname,
    _lname: request.body.lastname,
    _age: request.body.age,
    _gender: request.body.gender,
    _contactNumber: request.body.phone,
    _email: request.body.email,
    _address: request.body.address,
    _password: hash,
    _image: request.body.profileImage,
    _medicalHistory: request.body.medicalHistory,
    password: hash,
  };
  try {
    const updatedPatient = await patientSchema.updateOne(
      { _id: request.params.id },
      { $set: tempPatient }
    );
    response
      .status(200)
      .json({ message: "Patient updated successfully.", tempPatient });
  } catch (error) {
    next(error);
  }
};

// Patch a patient
exports.patchPatientById = async (request, response, next) => {
  let tempPatient = {};
  if (request.body.firstname) {
    tempPatient._fname = request.body.firstname;
  }
  if (request.body.lastname) {
    tempPatient._lname = request.body.lastname;
  }
  if (request.body.phone) {
    tempPatient._contactNumber = request.body._contactNumber;
  }
  if (request.body.medicalHistory) {
    tempPatient._medicalHistory = request.body.medicalHistory;
  }
  if (request.body.email) {
    tempPatient._email = request.body.email;
  }
  if (request.body.password) {
    const hash = await bcrypt.hash(request.body.password, 10);
    tempPatient._password = hash;
  }
  if (request.body.image) {
    tempPatient._image = request.body.profileImage;
  }
  if (request.body.address) {
    if (
      request.body.address.street ||
      request.body.address.city ||
      request.body.address.country ||
      request.body.address.zipCode
    ) {
      if (request.body.address.street)
        tempClinic["_address.street"] = request.body.address.street;
      if (request.body.address.city)
        tempClinic["_address.city"] = request.body.address.city;
      if (request.body.address.country)
        tempClinic["_address.country"] = request.body.address.country;
      if (request.body.address.zipCode)
        tempClinic["_address.zipCode"] = request.body.address.zipCode;
    } else {
      return response.status(200).json({ message: `Address can't be empty` });
    }
  }
  if (request.body.gender) {
    tempPatient._gender = request.body.gender;
  }
  if (request.body.age) {
    tempPatient._age = request.body.age;
  }

  try {
    let updatedPatient = await patientSchema.updateOne(
      { _id: request.params.id },
      { $set: tempPatient }
    );
    response
      .status(200)
      .json({ message: "Patient updated successfully.", tempPatient });
  } catch (error) {
    next(error);
  }
};

// Remove a patient
exports.removePatientById = async (request, response, next) => {
  try {
    const patient = await patientSchema.findByIdAndDelete(
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

// Get a patient by ID
exports.getPatientById = async (request, response, next) => {
  try {
    const patient = await patientSchema.findById(request.params.id);
    if (!patient) {
      return next(new Error("patient not found"));
    }
    response.status(200).json({ patient });
  } catch (error) {
    next(error);
  }
};
