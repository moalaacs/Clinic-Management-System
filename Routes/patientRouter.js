const express = require("express");
const controller = require("../Controller/patientController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const {
  validatePatient,
  validatePatchPatient,
  numberIdParamsValidation,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authorizationMW");

const router = express.Router();

router
  .route("/patient")
  .all(authorizationMW.checkAdmin)
  .get(controller.getAllPatients)
  .post(validatePatient, validatorMiddleware, controller.addPatient);

router
  .route("/patient/:id")
  .all(
    authorizationMW.checkPatient,
    numberIdParamsValidation,
    validatorMiddleware
  )
  .get(controller.getPatientById)
  .patch(
    controller.uploadPhoto,
    validatePatchPatient,
    validatorMiddleware,
    controller.patchPatientById
  );

router
  .route("/patient/:id")
  .all(
    authorizationMW.checkAdmin,
    numberIdParamsValidation,
    validatorMiddleware
  )
  .get(controller.getPatientById)
  .patch(validatePatchPatient, validatorMiddleware, controller.patchPatientById)
  .delete(controller.removePatientById);

module.exports = router;
