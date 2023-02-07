/*** callback fns for CRUD operations ***/

/* require bcrypt */
const bcrypt = require("bcrypt");

/* require all needed modules */
const patientSchema = require("../Models/patientModel");
const users = require("../Models/usersModel");
/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

// Get all Patients
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
    console.log(patient);
    const newUser = new users({
      _id: savedPatient._id,
      _role: "patient",
      _email: request.body.email,
      _contactNumber: request.body.phone,
      _password: hash,
    });
    await newUser.save();
    response
      .status(201)
      .json({ message: "Patient created successfully.", patient });
  } catch (error) {
    next(error);
  }
};

// Full Edit a patient
exports.putPatientById = async (request, response, next) => {
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
    const updatedPatient = await patientSchema.updateOne(
      { _id: request.params.id },
      {
        $set: {
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
        },
      }
    );
    await users.updateOne(
      { _id: request.params.id },
      {
        $set: {
          _email: request.body.email,
          _contactNumber: request.body.phone,
        },
      }
    );
    response
      .status(200)
      .json({ message: "Patient updated successfully.", updatedPatient });
  } catch (error) {
    next(error);
  }
};

// Edit a patient
exports.patchPatientById = async (request, response, next) => {
  try {
    let tempPatient = {};
    if (request.body.firstname) {
      tempPatient._fname = request.body.firstname;
    }
    if (request.body.lastname) {
      tempPatient._lname = request.body.lastname;
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
    if (request.body.medicalHistory) {
      tempPatient._medicalHistory = request.body.medicalHistory;
    }
    await patientSchema.updateOne(
      { _id: request.params.id },
      { $set: tempPatient }
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
    if (!patient) return response.status(200).json("Patient not found");
    await users.deleteOne({ _id: request.params.id });
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
