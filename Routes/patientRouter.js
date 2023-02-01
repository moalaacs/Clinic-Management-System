const express = require("express");
const controller = require("../Controller/patientController");
const errorValidation = require("../Middlewares/errorValidation");
const {
  validatePatient,
  validatePatchPatient,
  numberIdParamsValidation,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authenticationMW");

const router = express.Router();

router
  .route("/patients")
  .all(authorizationMW.checkAdmin)
  .get(controller.getPatients)
  .post(validatePatient, errorValidation, controller.addPatient);

router
  .route("/patients/:id")
  .all(numberIdParamsValidation, errorValidation, authorizationMW.checkPatient)
  .get(controller.getPatientById)
  .patch(validatePatchPatient, errorValidation, controller.editPatient);

router
  .route("/patients/:id")
  .all(numberIdParamsValidation, errorValidation, authorizationMW.checkAdmin)
  .get(controller.getPatientById)
  .patch(validatePatchPatient, errorValidation, controller.editPatient)
  .delete(controller.removePatient);

module.exports = router;
