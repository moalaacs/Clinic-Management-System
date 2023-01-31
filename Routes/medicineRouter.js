const express = require("express");
const { body, query, param, validationResult } = require("express-validator");
const controller = require("./../Controller/medicineController");
const validator = require("../Middlewares/errorValidation");
const {
  medicineValidation,
  numberIdParamsValidation,
  medicinePatchValidation,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authenticationMW");
const router = express.Router();

router
  .route("/medicine")
  .get(controller.getAllMedicine)
  .post(medicineValidation, validator, controller.addMedicine);

router
  .route("/medicine/:id")
  .all(numberIdParamsValidation, authorizationMW.checkAdmin)
  .get(validator, controller.getMedicineById)
  .patch(medicinePatchValidation, validator, controller.patchMedicineById)
  .put(medicineValidation, validator, controller.updateMedicineById)
  .delete(validator, controller.removeMedicineById);

module.exports = router;
