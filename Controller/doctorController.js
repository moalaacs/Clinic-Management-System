/*** callback fns for CRUD operations ***/

/* Doctor Schema */
const doctorSchema = require("../Models/doctorModel");

/* require bcrypt */
const bcrypt = require("bcrypt");

/* require all needed modules */
const clinicSchema = require("../Models/clinicModel");
const emailSchema = require("../Models/emailModel");
/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

exports.getAllDoctors = async (request, response, next) => {
  try {
    let query = reqNamesToSchemaNames(request.query);
    let doctors = await filterData(doctorSchema, query,[
      { path: 'clinicId', options: { strictPopulate: false } },
      { path: '_clinics', options: { strictPopulate: false } },
      { path: '_clinics', options: { strictPopulate: false } },
    ]);
    doctors = sortData(doctors, query);
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
    const doctor = new doctorSchema({
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
      _specilization: request.body.speciality,
      _clinics: request.body.clinic,
    });
    await doctor.save();
    await email.save();
    response
      .status(201)
      .json({ message: "Doctor created successfully.", doctor });
  } catch (error) {
    next(error);
  }
};

exports.putDoctorById = async (request, response, next) => {
  try {
    let now = new Date();
    let age = now.getFullYear() - request.body.dateOfBirth.split("/")[2];
    if (now.getMonth() < request.body.dateOfBirth.split("/")[1]) { age--;}
    const updatedDoctor = await doctorSchema.updateOne(
      { _id: request.params.id },
      {
        $set: {
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
          _specilization: request.body.speciality,
          _clinics: request.body.clinic,
        },
      }
    );
    response
      .status(200)
      .json({ status: "Doctor updated successfully", updatedDoctor });
  } catch (error) {
    next(error);
  }
};

exports.patchDoctorById = async (request, response, next) => {
  let tempDoctor = {};
  if (request.body.firstname) {
    tempPatient._fname = request.body.firstname;
  }
  if (request.body.lastname) {
    tempPatient._lname = request.body.lastname;
  }
  if (request.body.speciality) {
    tempDoctor._specilization = request.body.speciality;
  }
  if (request.body.phone) {
    tempDoctor._contactNumber = request.body.phone;
  }
  if (request.body.schedule) {
    tempDoctor.schedule = request.body.schedule;
  }

  if (request.body.clinic) {
    tempDoctor._clinics = request.body.clinic;
  }
  if (request.body.email) {
    tempDoctor._email = request.body.email;
  }
  if (request.body.password) {
    const hash = await bcrypt.hash(request.body.password, 10);
    tempDoctor._password = hash;
  }
  if (request.body.image) {
    tempDoctor._image = request.body.profileImage;
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
    tempDoctor._gender = request.body.gender;
  }
  if (request.body.dateOfBirth) {
    tempPatient._dateOfBirth = request.body.dateOfBirth;
    let now = new Date();
    let age = now.getFullYear() - request.body.dateOfBirth.split("/")[2];
    if (now.getMonth() < request.body.dateOfBirth.split("/")[1]) { age--;} 
    tempPatient._age = age;     
  }

  try {
    let updatedDoctor = await doctorSchema.updateOne(
      { _id: request.params.id },
      { $set: tempDoctor }
    );
    response
      .status(200)
      .json({ message: "Doctor updated successfully.", updatedDoctor });
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
    speciality: '_specilization',
    clinic: '_clinics',
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