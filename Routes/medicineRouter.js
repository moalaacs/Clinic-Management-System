const express = require("express");
const controller = require("./../Controller/medicineController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const {
  medicineValidation,
  numberIdParamsValidation,
  medicinePatchValidation,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authorizationMW");
const router = express.Router();

router
  .route("/medicine")
  .get(controller.getAllMedicine)
  .post(controller.uploadImage, medicineValidation, validatorMiddleware, controller.addMedicine);

router
  .route("/medicine/:id")
  .all(
    authorizationMW.checkAdmin,
    numberIdParamsValidation,
    validatorMiddleware
  )
  .get(validatorMiddleware, controller.getMedicineById)
  .patch(
    medicinePatchValidation,
    validatorMiddleware,
    controller.patchMedicineById
  )
  .put(medicineValidation, validatorMiddleware, controller.putMedicineById)
  .delete(validatorMiddleware, controller.removeMedicineById);

module.exports = router;
