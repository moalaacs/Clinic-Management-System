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
  .get(numberIdParamsValidation, validatorMiddleware, controller.getDoctorById)
  .put(
    numberIdParamsValidation,
    doctorValidation,
    validatorMiddleware,
    controller.updateDoctorById
  )
  .patch(
    numberIdParamsValidation,
    doctorPatchValidation,
    validatorMiddleware,
    controller.patchDoctorById
  )
  .delete(
    numberIdParamsValidation,
    validatorMiddleware,
    controller.removeDoctorById
  );

module.exports = router;
