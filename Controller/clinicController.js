/* require all needed modules */
const clinicSchema = require("../Models/clinicModel");
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

// Calling other schemas //
const users = require("../Models/usersModel");
const employeeSchema = require("../Models/employeeModel");
const doctorSchema = require("../Models/doctorModel");

// Create a new clinic
exports.addClinic = async (request, response, next) => {
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
    let testClinicSpeciality = await clinicSchema.findOne({
      _specilization: request.body.speciality,
    });
    if (testClinicSpeciality)
      return response
        .status(400)
        .json({ message: `There is already a clinic with this speciality` });
    const clinic = new clinicSchema({
      _contactNumber: request.body.phone,
      _email: request.body.email,
      _address: request.body.address,
      _specilization: request.body.speciality,
    });
    let savedClinic = await clinicSchema.save();
    let email = new users({
      _email: request.body.email,
      _password: "admin",
      _role: "admin",
      _id: savedClinic._id,
      _contactNumber: request.body.phone,
      _forClinic: savedClinic._id,
    });
    await email.save();
    response
      .status(201)
      .json({ message: "Clinic created successfully.", clinic });
  } catch (error) {
    next(error);
  }
};

// Edit a clinic
exports.patchClinicById = async (request, response, next) => {
  try {
    let tempClinic = {};
    let tempUser = {};
    if (request.body.phone) {
      let testPhone = await users.findOne({
        _contactNumber: request.body.phone,
      });
      if (testPhone) {
        return response.status(400).json({ message: `Phone Already in use` });
      }
      tempClinic._contactNumber = request.body.phone;
      tempUser._contactNumber = request.body.phone;
    }
    if (request.body.email) {
      let testEmail = await users.findOne({ _email: request.body.email });
      if (testEmail) {
        return response.status(400).json({ message: `Email Already in use` });
      }
      tempClinic._email = request.body.email;
      tempUser._email = request.body.email;
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
    if (request.body.speciality) {
      let testClinicSpeciality = await clinicSchema.findOne({
        _specilization: request.body.speciality,
      });
      if (testClinicSpeciality)
        return response
          .status(400)
          .json({ message: `There is already a clinic with this speciality` });
      tempClinic._specilization = request.body.speciality;
    }
    await clinicSchema.updateOne(
      { _id: request.params.id },
      {
        $set: tempClinic,
      }
    );
    await users.updateOne(
      { _id: request.params.id },
      {
        $set: tempUser,
      }
    );
    response
      .status(200)
      .json({ message: "Clinic updated successfully.", Updated: tempClinic });
  } catch (error) {
    next(error);
  }
};

// Remove a clinic
exports.removeClinicById = async (request, response, next) => {
  try {
    const clinic = await clinicSchema.findByIdAndDelete(request.params.id);
    if (!clinic) {
      return next(new Error("Clinic not found"));
    }
    let existingEmails = await employeeSchema.find(
      { _clinic: request.params.id },
      { _email: 1, _id: 0 }
    );
    let ArrayOfExistingEmails = existingEmails.map((element) => element._email);
    await employeeSchema.deleteMany({ _clinic: request.params.id });
    await doctorSchema.updateMany(
      { _clinics: request.params.id },
      {
        $pull: {
          _clinics: request.params.id,
        },
      }
    );
    await users.deleteMany({ _email: { $in: ArrayOfExistingEmails } });
    response
      .status(201)
      .json({ message: "Clinic removed successfully.", clinic });
  } catch (error) {
    next(error);
  }
};

// Get a clinic by ID
exports.getClinicById = async (request, response, next) => {
  try {
    const clinic = await clinicSchema.findById(request.params.id);
    if (!clinic) {
      return next(new Error("Clinic not found"));
    }
    response.status(200).json({ clinic });
  } catch (error) {
    next(error);
  }
};

exports.getAllClinics = async (request, response, next) => {
  try {
    let clinics = await filterData(clinicSchema, request.query);
    clinics = sortData(clinics, request.query);
    clinics = paginateData(clinics, request.query);
    clinics = sliceData(clinics, request.query);
    response.status(200).json({ clinics });
  } catch (error) {
    next(error);
  }
};
