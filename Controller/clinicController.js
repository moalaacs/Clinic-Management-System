/* require all needed modules */
const Clinic = require("../Models/clinicModel");

// Create a new clinic
exports.createClinic = (req, res, next) => {
  const newClinic = new Clinic({
    name: req.body.name,
    contactNumber: req.body.contactNumber,
    email: req.body.email,
    address: req.body.location,
  });

  Clinic.findOne({ name: req.body.name })
    .then((data) => {
      if (data != null) {
        throw new Error("Duplicated clinic");
      } else {
        newClinic
          .save()
          .then((data) => {
            res
              .status(201)
              .json({ message: "Clinic added successfully", data });
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
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
