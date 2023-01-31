/*** callback fns for CRUD operations ***/

/* require bcrypt */
const bcrypt = require("bcrypt");

/* require all needed modules */
const Patient = require("../Models/patientModel");

/* require helper functions (filter,sort,slice,paginate) */
const { filterData, sortData, sliceData, paginateData } = require("../helper/helperfns");


// Create a new patient
exports.createPatient = async (req, res,next) => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    const patient = new Patient({
      ...req.body,
      password: hash
    });
    await patient.save();
    res.status(201).json({ message: "Patient created successfully.", patient });
  } catch (error) {next(error);}
};

// Edit a patient
exports.editPatient = async (req, res,next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id,req.body,{ new: true });
    res.status(200).json({ message: "Patient updated successfully.", patient });
  } catch (error) {next(error);}
};



// Remove a patient
exports.removePatient = async (req, res,next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id || req.body.id);
    if (!patient) {return next(new Error('patient not found'));}
    res.status(201).json({ message: "Patient removed successfully.", patient });
  } catch (error) {next(error);}
};


exports.getPatients = async (req, res, next) => {
  try {
    let patients = await filterData(Patient, req.query);
    patients = sortData(patients, req.query);
    patients = paginateData(patients, req.query);
    patients = sliceData(patients,req.query);

    res.status(200).json({ patients });
  } catch (error) {
    next(error);
  }
};


// Get a patient by ID
exports.getPatientById = async (req, res,next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {return next(new Error('patient not found'));}
    res.status(200).json({ patient });
  } catch (error) {next(error);}
};


// exports.filterPatients = (req, res, next) => {
// 	errorHandeler(req);
//     PatientModel.find({"location.governorate":req.body.governorate})
// 		.then((user) => {
// 			if (!user) {
// 				return res.status(404).send("User not found");
// 			}
// 			res.status(302).send(user);
// 		})
// 		.catch((e) => {
// 			res.status(500).send(e);
// 		});
// };

// exports.sortPatients = (req, res, next) => {
// 	errorHandeler(req);

//     PatientModel.find({}).sort({ name : 1})
//     .then((user) => {
//         if (!user) {
//             return res.status(404).send("User not found");
//         }
//         res.status(302).send(user);
//     })
//     .catch((e) => {
//         res.status(500).send(e);
//     });
// };
