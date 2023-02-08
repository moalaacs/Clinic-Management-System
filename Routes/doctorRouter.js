const express = require("express");
const controller = require("../Controller/doctorController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const {
  doctorValidation,
  doctorPatchValidation,
  numberIdParamsValidation,
} = require("../Middlewares/validateData");
const router = express.Router();

router
  .route("/doctor")
  .get(controller.getAllDoctors)
  .post(doctorValidation, validatorMiddleware, controller.addDoctor);

router
  .route("/doctor/:id")
  .all(numberIdParamsValidation, validatorMiddleware)
  .get(controller.getDoctorById)
  .put(doctorValidation, validatorMiddleware, controller.putDoctorById)
  .patch(controller.uploadPhoto, doctorPatchValidation, validatorMiddleware, controller.patchDoctorById)
  .delete(controller.removeDoctorById);

module.exports = router;
