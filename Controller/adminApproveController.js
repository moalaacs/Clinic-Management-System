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

exports.reigsterDoctor = async (request, response, next) => {
  try {
    const sentClinics = request.body.clinic;
    const existingClinics = await clinicSchema.find({
      _id: { $in: sentClinics },
    });
    if (sentClinics.length != existingClinics.length) {
      return response.status(400).json({ message: "Check clinics id" });
    }
    let testEmailandPhone = await users.findOne({
      $or: [
        { _email: request.body.email },
        { _contactNumber: request.body.phone },
      ],
    });
    if (testEmailandPhone._email == request.body.email) {
      return response.status(400).json({ message: `Email Already in use` });
    }
    if (testEmailandPhone._contactNumber == request.body.phone) {
      return response
        .status(400)
        .json({ message: `Phone number Already in use` });
    }
    const hash = await bcrypt.hash(request.body.password, 10);
    const doctor = new doctorSchema({
      _fname: request.body.firstname,
      _lname: request.body.lastname,
      _age: request.body.age,
      _gender: request.body.gender,
      _contactNumber: request.body.phone,
      _email: request.body.email,
      _address: request.body.address,
      _password: hash,
      _image: request.body.profileImage,
      _specilization: request.body.speciality,
      _clinics: request.body.clinic,
    });
    let savedDoctor = await doctor.save();
    const newUser = new users({
      _id: savedDoctor._id,
      _role: "doctor",
      _email: request.body.email,
      _contactNumber: request.body.phone,
    });
    await newUser.save();
    response
      .status(201)
      .json({ message: "Doctor created successfully.", doctor });
  } catch (error) {
    next(error);
  }
};

exports.reigsterEmployee = async (request, response, next) => {
  try {
    const sentClinics = request.body.clinic;
    const existingClinics = await clinicSchema.find({
      _id: { $in: sentClinics },
    });
    if (sentClinics.length != existingClinics.length) {
      return response.status(400).json({ message: "Check clinics id" });
    }
    const hash = await bcrypt.hash(request.body.password, 10);
    let testEmailandPhone = await users.findOne({
      $or: [
        { _email: request.body.email },
        { _contactNumber: request.body.phone },
      ],
    });
    if (testEmailandPhone._email == request.body.email) {
      return response.status(400).json({ message: `Email Already in use` });
    }
    if (testEmailandPhone._contactNumber == request.body.phone) {
      return response
        .status(400)
        .json({ message: `Phone number Already in use` });
    }
    const employee = new EmployeeSchema({
      _fname: request.body.firstname,
      _lname: request.body.lastname,
      _age: request.body.age,
      _gender: request.body.gender,
      _contactNumber: request.body.phone,
      _email: request.body.email,
      _address: request.body.address,
      _password: hash,
      _image: request.body.profileImage,
      password: hash,
      _clinic: request.body.clinic,
      _monthlyRate: request.body.salary,
      _workingHours: request.body.workingHours,
    });
    let savedEmployee = await employee.save();
    const newUser = new users({
      _id: savedEmployee._id,
      _role: "employee",
      _email: request.body.email,
      _contactNumber: request.body.phone,
    });
    await newUser.save();
    response
      .status(201)
      .json({ message: "Employee created successfully.", employee });
  } catch (error) {
    next(error);
  }
};

exports.reigsterPatient = async (request, response, next) => {
  try {
    let testEmailandPhone = await users.findOne({
      $or: [
        { _email: request.body.email },
        { _contactNumber: request.body.phone },
      ],
    });
    if (testEmailandPhone._email == request.body.email) {
      return response.status(400).json({ message: `Email Already in use` });
    }
    if (testEmailandPhone._contactNumber == request.body.phone) {
      return response
        .status(400)
        .json({ message: `Phone number Already in use` });
    }
    const hash = await bcrypt.hash(request.body.password, 10);
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
    let savedPatient = await patient.save();
    const newUser = new users({
      _id: savedPatient._id,
      _role: "patient",
      _email: request.body.email,
      _contactNumber: request.body.phone,
    });
    await newUser.save();
    response
      .status(201)
      .json({ message: "Patient created successfully.", patient });
  } catch (error) {
    next(error);
  }
};
