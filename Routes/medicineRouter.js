const express = require("express");
const { body, query, param, validationResult } = require("express-validator");
const controller = require("./../Controller/medicineController");
const validator = require("../Middlewares/errorValidation");
const { medicineValidation } = require("../Middlewares/validateData");
const router = express.Router();

router
  .route("/medicine")
  .get(controller.getAllMedicine)
  .post(medicineValidation, validator, controller.addMedicine)
  .patch(medicineValidation, validator, controller.updateMedicine);

router.delete(
  "/medicine/:name",
  param("name").isString().withMessage("Name must be string"),
  validator,
  controller.deleteMedicine
);

router.get(
  "/medicine/:name",
  param("name").isString().withMessage("Name must be string"),
  validator,
  controller.getMedicine
);

module.exports = router;
