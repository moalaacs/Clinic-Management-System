const express = require("express");
const controller = require("../Controller/doctorController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const {
  doctorValidation,
  doctorPatchValidation,
  numberIdParamsValidation,
} = require("../Middlewares/validateData");
const router = express.Router();
const { upload } = require("../Middlewares/multer");

router
  .route("/doctor")
  .get(controller.getAllDoctors)
  .post(
    upload.single("photo"),
    doctorValidation,
    validatorMiddleware,
    controller.addDoctor
  );

router
  .route("/doctor/:id")
  .all(numberIdParamsValidation, validatorMiddleware)
  .get(controller.getDoctorById)
  .put(
    upload.single("photo"),
    doctorValidation,
    validatorMiddleware,
    controller.putDoctorById
  )
  .patch(
    upload.single("photo"),
    doctorPatchValidation,
    validatorMiddleware,
    controller.patchDoctorById
  )
  .delete(controller.removeDoctorById);

module.exports = router;
