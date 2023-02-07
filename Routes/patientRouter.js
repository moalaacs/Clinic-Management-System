const express = require("express");
const controller = require("../Controller/patientController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const {
  validatePatient,
  validatePatchPatient,
  numberIdParamsValidation,
} = require("../Middlewares/validateData");
const { authorize } = require("../Middlewares/authenticationMW");

const router = express.Router();

router
  .route("/patient")
  .all(authorize("admin"))
  .get(controller.getAllPatients)
  .post(validatePatient, validatorMiddleware, controller.addPatient);

router
  .route("/patient/:id")
  .all(authorize("patient"), numberIdParamsValidation, validatorMiddleware)
  .get(controller.getPatientById)
  .patch(
    validatePatchPatient,
    validatorMiddleware,
    controller.patchPatientById
  );

router
  .route("/patient/:id")
  .all(authorize("admin"), numberIdParamsValidation, validatorMiddleware)
  .get(controller.getPatientById)
  .patch(validatePatchPatient, validatorMiddleware, controller.patchPatientById)
  .delete(controller.removePatientById);

module.exports = router;
