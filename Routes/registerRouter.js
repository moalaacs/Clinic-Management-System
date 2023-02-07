const express = require("express");
const doctorController = require("../Controller/doctorController");
const employeeController = require("../Controller/employeeController");
const patientController = require("../Controller/patientController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const {
  doctorValidation,
  validatePatient,
  employeeValidation,
} = require("../Middlewares/validateData");

const router = express.Router();

router
  .route("/register/doctor")
  .post(doctorValidation, validatorMiddleware, doctorController.addDoctor);

router
  .route("/register/employee")
  .post(
    employeeValidation,
    validatorMiddleware,
    employeeController.addEmployee
  );

router
  .route("/register/patient")
  .post(validatePatient, validatorMiddleware, patientController.addPatient);

module.exports = router;
