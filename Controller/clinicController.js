/* require all needed modules */
const { json } = require("express");
const Clinic = require("../Models/clinicModel");
const emailSchema = require("../Models/emailModel");
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");
// Create a new clinic

exports.createClinic = async (request, response, next) => {
  try {
    let testEmail = await emailSchema.findOne({ email: request.body.email });
    console.log(testEmail);
    if (testEmail) {
      return response.status(400).json({ message: `Email Already in use` });
    } else {
      let email = new emailSchema({ email: request.body.email });
      await email.save();
    }
    const clinic = new Clinic({
      ...request.body,
    });
    await clinic.save();
    response
      .status(201)
      .json({ message: "Clinic created successfully.", clinic });
  } catch (error) {
    next(error);
  }
};

// Edit a clinic
exports.editClinic = (req, res, next) => {
  try {
    const clinic = Clinic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Clinic updated successfully.", clinic });
  } catch (error) {
    next(error);
  }
};

// Remove a clinic
exports.removeClinic = (req, res, next) => {
  try {
    const clinic = Clinic.findByIdAndDelete(req.params.id);
    if (!clinic) {
      return next(new Error("Clinic not found"));
    }
    res.status(201).json({ message: "Clinic removed successfully.", clinic });
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
exports.getClinicById = (req, res, next) => {
  try {
    const clinic = Clinic.findById(req.params.id);
    if (!clinic) {
      return next(new Error("Clinic not found"));
    }
    res.status(200).json({ clinic });
  } catch (error) {
    next(error);
  }
};
