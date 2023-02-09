const express = require("express");
const controller = require("../Controller/patientController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const {
  validatePatient,
  validatePatchPatient,
  numberIdParamsValidation,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authorizationMW");
const { upload } = require("../Middlewares/multerp");
const router = express.Router();

router
  .route("/patient")
  .all(authorizationMW.access())
  .get(controller.getAllPatients)
  .post(
    upload.single("photo"),
    validatePatient,
    validatorMiddleware,
    controller.addPatient
  );

router
  .route("/patient/:id")
  .all(
    authorizationMW.checkPatient,
    numberIdParamsValidation,
    validatorMiddleware
  )
  .get(controller.getPatientById)
  .patch(
    upload.single("photo"),
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
  .put(validatePatient, validatorMiddleware, controller.putPatientById)
  .delete(controller.removePatientById);

module.exports = router;
