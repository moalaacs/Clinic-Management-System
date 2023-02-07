const express = require("express");
const controller = require("./../Controller/medicineController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const {
  medicineValidation,
  numberIdParamsValidation,
  medicinePatchValidation,
} = require("../Middlewares/validateData");
const { authorize } = require("../Middlewares/authenticationMW");
const router = express.Router();

router
  .route("/medicine")
  .all(authorize("admin"))
  .get(controller.getAllMedicine)
  .post(medicineValidation, validatorMiddleware, controller.addMedicine);

router
  .route("/medicine/:id")
  .all(authorize("admin"), numberIdParamsValidation, validatorMiddleware)
  .get(validatorMiddleware, controller.getMedicineById)
  .patch(
    medicinePatchValidation,
    validatorMiddleware,
    controller.patchMedicineById
  )
  .put(medicineValidation, validatorMiddleware, controller.putMedicineById)
  .delete(validatorMiddleware, controller.removeMedicineById);

module.exports = router;
