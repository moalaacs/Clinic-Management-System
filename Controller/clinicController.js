/* require all needed modules */
const Clinic = require("../Models/clinicModel");
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

// Calling other schemas //
const emailSchema = require("../Models/emailModel");
const employeeSchema = require("../Models/employeeModel");
const doctorSchema = require("../Models/doctorModel");

// Create a new clinic
exports.addClinic = async (request, response, next) => {
  try {
    let testEmail = await emailSchema.findOne({ _email: request.body.email });
    if (testEmail) {
      return response.status(400).json({ message: `Email Already in use` });
    } else {
      let email = new emailSchema({ _email: request.body.email });
      await email.save();
    }
    const clinic = new Clinic({
      _contactNumber: request.body.phone,
      _email: request.body.email,
      _address: request.body.address,
    });
    let saved = await clinic.save();
    response
      .status(201)
      .json({ message: "Clinic created successfully.", clinic });
  } catch (error) {
    next(error);
  }
};

// Edit a clinic
exports.patchClinic = async (request, response, next) => {
  let tempClinic = {};
  if (request.body.phone) {
    tempClinic._contactNumber = request.body.phone;
  }
  if (request.body.email) {
    let testEmail = await emailSchema.findOne({ _email: request.body.email });
    if (testEmail) {
      return response.status(400).json({ message: `Email Already in use` });
    } else {
      let email = new emailSchema({ _email: request.body.email });
      await email.save();
    }
    tempClinic._email = request.body.email;
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
  try {
    const clinic = await Clinic.updateOne(
      { _id: request.params.id },
      {
        $set: tempClinic,
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
    const clinic = await Clinic.findByIdAndDelete(request.params.id);
    if (!clinic) {
      return next(new Error("Clinic not found"));
    }
    await employeeSchema.deleteMany({ _clinic: request.params.id });
    await doctorSchema
      .updateMany(
        { _clinics: request.params.id },
        {
          $pull: {
            _clinics: request.params.id,
          },
        }
      )
      .exec(() => {
        console.log(this);
        console.log("hello");
        console.log("_________");
      });
    response
      .status(201)
      .json({ message: "Clinic removed successfully.", clinic });
  } catch (error) {
    next(error);
  }
};

exports.getAllClinics = async (request, response, next) => {
  try {
    let clinic = await filterData(Clinic, request.query);
    clinic = sortData(clinic, request.query);
    clinic = paginateData(clinic, request.query);
    clinic = sliceData(clinic, request.query);
    response.status(200).json(clinic);
  } catch (error) {
    next(error);
  }
};

// Get a clinic by ID
exports.getClinicById = async (request, response, next) => {
  try {
    const clinic = await Clinic.findById(request.params.id);
    if (!clinic) {
      return next(new Error("Clinic not found"));
    }
    response.status(200).json({ clinic });
  } catch (error) {
    next(error);
  }
};
