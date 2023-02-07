const express = require("express");
const controller = require("../Controller/clinicController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const { authorize } = require("../Middlewares/authenticationMW");
const {
  numberIdParamsValidation,
  validateClinic,
  validatePatchClinic,
} = require("../Middlewares/validateData");

const router = express.Router();

router
  .route("/clinic")
  .all(authorize("admin"))
  .get(controller.getAllClinics)
  .post(validateClinic, validatorMiddleware, controller.addClinic);

router
  .route("/clinic/:id")
  .all(authorize("admin"), numberIdParamsValidation, validatorMiddleware)
  .get(controller.getClinicById)
  .patch(validatePatchClinic, validatorMiddleware, controller.patchClinicById)
  .delete(controller.removeClinicById);

module.exports = router;
