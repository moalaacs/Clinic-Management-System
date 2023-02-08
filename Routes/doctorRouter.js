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
  .post(
    doctorValidation,
    validatorMiddleware,
    controller.uploadPhoto,
    controller.addDoctor
  );

router
  .route("/doctor/:id")
  .all(numberIdParamsValidation, validatorMiddleware)
  .get(controller.getDoctorById)
  .put(
    doctorValidation,
    validatorMiddleware,
    controller.uploadPhoto,
    controller.putDoctorById
  )
  .patch(
    doctorPatchValidation,
    validatorMiddleware,
    controller.uploadPhoto,
    controller.patchDoctorById
  )
  .delete(controller.removeDoctorById);

module.exports = router;
