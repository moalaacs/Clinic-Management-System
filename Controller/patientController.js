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
    let query = reqNamesToSchemaNames(request.query);
    let patients = await filterData(patientSchema, query);
    patients = sortData(patients, query);
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
    let email;
    let testEmail = await emailSchema.findOne({ _email: request.body.email });
    if (testEmail) {
      return response.status(400).json({ message: `Email Already in use` });
    } else {
      email = new emailSchema({ _email: request.body.email });
    }
    const hash = await bcrypt.hash(request.body.password, 10);

    let now = new Date();
    let age = now.getFullYear() - request.body.dateOfBirth.split("/")[2];
    if (now.getMonth() < request.body.dateOfBirth.split("/")[1]) { age--;}      

    const patient = new patientSchema({
      _fname: request.body.firstname,
      _lname: request.body.lastname,
      _dateOfBirth: request.body.dateOfBirth,
      _age: age,
      _gender: request.body.gender,
      _contactNumber: request.body.phone,
      _email: request.body.email,
      _address: request.body.address,
      _password: hash,
      _image: request.body.profileImage,
      _medicalHistory: request.body.medicalHistory,
    });
    await patient.save();
    await email.save();
    response
      .status(201)
      .json({ message: "Patient created successfully.", patient });
  } catch (error) {
    next(error);
  }
};

// Put a patient
exports.putPatientById = async (request, response, next) => {
  let now = new Date();
  let age = now.getFullYear() - request.body.dateOfBirth.split("/")[2];
  if (now.getMonth() < request.body.dateOfBirth.split("/")[1]) { age--;}      

  let tempPatient = {
    _fname: request.body.firstname,
    _lname: request.body.lastname,
    _dateOfBirth: request.body.dateOfBirth,
    _age: age,
    _gender: request.body.gender,
    _contactNumber: request.body.phone,
    _email: request.body.email,
    _address: request.body.address,
    _password: hash,
    _image: request.body.profileImage,
    _medicalHistory: request.body.medicalHistory,
  };
  try {
    const updatedPatient = await patientSchema.updateOne(
      { _id: request.params.id },
      { $set: tempPatient }
    );
    response
      .status(200)
      .json({ message: "Patient updated successfully.", updatedPatient });
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
  if (request.body.dateOfBirth) {
    tempPatient._dateOfBirth = request.body.dateOfBirth;
    let now = new Date();
    let age = now.getFullYear() - request.body.dateOfBirth.split("/")[2];
    if (now.getMonth() < request.body.dateOfBirth.split("/")[1]) { age--;} 
    tempPatient._age = age;     
  }

  try {
    let updatedPatient = await patientSchema.updateOne(
      { _id: request.params.id },
      { $set: tempPatient }
    );
    response
      .status(200)
      .json({ message: "Patient updated successfully.",updatedPatient, tempPatient });
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





const reqNamesToSchemaNames = (query) => {
  const fieldsToReplace = {
    id:'_id',
    firstname: '_fname',
    lastname: '_lname',
    dateOfBirth: '_dateOfBirth',
    age: '_age',
    gender: '_gender',
    phone: '_contactNumber',
    email: '_email',
    address: '_address',
    profileImage: '_image',
    medicalHistory: '_medicalHistory'
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
}
