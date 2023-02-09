const express = require("express");
const controller = require("../Controller/patientController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const {
  validatePatient,
} = require("../Middlewares/validateData");
const { upload } = require("../Middlewares/multer");
const router = express.Router();

router
  .route("/register")
  .post(
    upload.single("photo"),
    validatePatient,
    validatorMiddleware,
    controller.addPatient
  );


module.exports = router;
