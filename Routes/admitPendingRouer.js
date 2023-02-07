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
  .route("/pending/:id/admit")
  .post(doctorValidation, validatorMiddleware, doctorController.addDoctor);
router
  .route("/pending/:id/deny")
  .post(doctorValidation, validatorMiddleware, doctorController.addDoctor);

module.exports = router;
