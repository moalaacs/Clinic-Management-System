/* require bcrypt */
const bcrypt = require("bcrypt");

/* require multer */
const multer = require("multer");

/* require all needed modules */
const doctorSchema = require("../Models/doctorModel");
const clinicSchema = require("../Models/clinicModel");
const users = require("../Models/usersModel");

/* upload image */
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, `doctor-${Date.now()}.${extension}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadPhoto = upload.single("photo");

/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
  mapSpecilityToSpecilization,
} = require("../helper/helperfns");

exports.getAllDoctors = async (request, response, next) => {
  try {
    let query = reqNamesToSchemaNames(request.query);
    let doctors = await filterData(doctorSchema, query, [
      {
        path: "_schedule.clinicId",
        options: { strictPopulate: false },
        select: { _specilization: 1, _address: 1, _id: 0 },
      },
      {
        path: "_clinic",
        options: { strictPopulate: false },
        select: { _specilization: 1, _address: 1, _id: 0 },
      },
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
    const existingClinics = await clinicSchema.find(
      {},
      { _id: 1, _specilization: 1 }
    );
    let specialityClinicId = mapSpecilityToSpecilization(
      request.body.speciality
    );
    specialityClinicId = existingClinics.find(
      (element) => element._specilization == specialityClinicId
    );
    if (!specialityClinicId)
      return response.status(400).json({
        message: `Sorry, We don't have a department for ${request.body.speciality} yet`,
      });
    let testEmailandPhone = await users.findOne({
      $or: [
        { _email: request.body.email },
        { _contactNumber: request.body.phone },
      ],
    });
    if (testEmailandPhone) {
      if (testEmailandPhone._email == request.body.email) {
        return response.status(400).json({ message: `Email Already in use` });
      } else if (testEmailandPhone._contactNumber == request.body.phone) {
        return response
          .status(400)
          .json({ message: `Phone number Already in use` });
      }
    }
    const hash = await bcrypt.hash(request.body.password, 10);
    let now = new Date();
    let age = now.getFullYear() - request.body.dateOfBirth.split("/")[2];
    if (now.getMonth() < request.body.dateOfBirth.split("/")[1]) {
      age--;
    }
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
      _clinic: specialityClinicId._id,
    });
    let savedDoctor = await doctor.save();
    const newUser = new users({
      _id: savedDoctor._id,
      _role: "doctor",
      _email: request.body.email,
      _contactNumber: request.body.phone,
      _password: hash,
    });
    await newUser.save();
    response
      .status(201)
      .json({ message: "Doctor created successfully.", doctor });
  } catch (error) {
    next(error);
  }
};

exports.putDoctorById = async (request, response, next) => {
  try {
    const existingClinics = await clinicSchema.find(
      {},
      { _id: 1, _specilization: 1 }
    );
    let specialityClinicId = mapSpecilityToSpecilization(
      request.body.speciality
    );
    specialityClinicId = existingClinics.find(
      (element) => element._specilization == specialityClinicId
    );
    if (!specialityClinicId)
      return response.status(400).json({
        message: `Sorry, We don't have a department for ${request.body.speciality} yet`,
      });
    let testEmailandPhone = await users.findOne({
      $or: [
        { _email: request.body.email },
        { _contactNumber: request.body.phone },
      ],
    });
    if (testEmailandPhone) {
      if (testEmailandPhone._email == request.body.email) {
        return response.status(400).json({ message: `Email Already in use` });
      } else if (testEmailandPhone._contactNumber == request.body.phone) {
        return response
          .status(400)
          .json({ message: `Phone number Already in use` });
      }
    }
    const hash = await bcrypt.hash(request.body.password, 10);
    let now = new Date();
    let age = now.getFullYear() - request.body.dateOfBirth.split("/")[2];
    if (now.getMonth() < request.body.dateOfBirth.split("/")[1]) {
      age--;
    }
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
          _clinic: specialityClinicId._id,
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
  try {
    let tempDoctor = {};
    if (request.body.firstname) {
      tempPatient._fname = request.body.firstname;
    }
    if (request.body.lastname) {
      tempPatient._lname = request.body.lastname;
    }
    if (request.body.speciality) {
      const existingClinics = await clinicSchema.find(
        {},
        { _id: 1, _specilization: 1 }
      );
      let specialityClinicId = mapSpecilityToSpecilization(
        request.body.speciality
      );
      specialityClinicId = existingClinics.find(
        (element) => element._specilization == specialityClinicId
      );
      if (!specialityClinicId)
        return response.status(400).json({
          message: `Sorry, We don't have a department for ${request.body.speciality} yet`,
        });
      tempDoctor._specilization = request.body.speciality;
      tempDoctor._clinic = specialityClinicId._id;
    }
    if (request.body.phone) {
      let testPhone = await users.findOne({
        _contactNumber: request.body.phone,
      });
      if (testPhone) {
        return response
          .status(400)
          .json({ message: `Phone number Already in use` });
      }
      await users.updateOne(
        { _id: request.params.id },
        { $set: { _contactNumber: request.body.phone } }
      );
      tempDoctor._contactNumber = request.body.phone;
    }
    //
    if (request.body.schedule) {
      tempDoctor.schedule = request.body.schedule;
    }
    //
    if (request.body.email) {
      let testEmail = await users.findOne({
        _email: request.body.email,
      });
      if (testEmail) {
        return response.status(400).json({ message: `Email Already in use` });
      }
      await users.updateOne(
        { _id: request.params.id },
        { $set: { _email: request.body.email } }
      );
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
      tempDoctor._dateOfBirth = request.body.dateOfBirth;
      let now = new Date();
      let age = now.getFullYear() - request.body.dateOfBirth.split("/")[2];
      if (now.getMonth() < request.body.dateOfBirth.split("/")[1]) {
        age--;
      }
      tempDoctor._age = age;
    }
    await doctorSchema.updateOne(
      { _id: request.params.id },
      { $set: tempDoctor }
    );
    if (request.body.email && request.body.phone) {
      await users.updateOne(
        { _id: request.params.id },
        {
          $set: {
            _email: request.body.email,
            _contactNumber: request.body.phone,
          },
        }
      );
    } else if (request.body.email) {
      await users.updateOne(
        { _id: request.params.id },
        { $set: { _email: request.body.email } }
      );
    } else if (request.body.phone) {
      await users.updateOne(
        { _id: request.params.id },
        { $set: { _contactNumber: request.body.phone } }
      );
    }
    response
      .status(200)
      .json({ message: "Doctor updated successfully.", tempDoctor });
  } catch (error) {
    next(error);
  }
};

exports.getDoctorById = async (request, response, next) => {
  try {
    let doctor = await doctorSchema
      .find({ _id: request.params.id })
      .populate({
        path: "_schedule.clinicId",
        options: { strictPopulate: false },
        select: { _specilization: 1, _address: 1, _id: 0 },
      })
      .populate({
        path: "_clinic",
        options: { strictPopulate: false },
        select: { _specilization: 1, _address: 1, _id: 0 },
      });
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
    const doctor = await doctorSchema.deleteOne({ _id: request.params.id });
    if (!doctor) return response.status(200).json("Doctor not found");
    await users.deleteOne({ _id: request.params.id });
    response
      .status(200)
      .json({ message: "Doctor removed successfully.", doctor });
  } catch (error) {
    next(error);
  }
};

const reqNamesToSchemaNames = (query) => {
  const fieldsToReplace = {
    id: "_id",
    firstname: "_fname",
    lastname: "_lname",
    dateOfBirth: "_dateOfBirth",
    age: "_age",
    gender: "_gender",
    phone: "_contactNumber",
    email: "_email",
    address: "_address",
    profileImage: "_image",
    speciality: "_specilization",
    clinic: "_clinics",
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
