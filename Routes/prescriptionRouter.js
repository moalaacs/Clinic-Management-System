const express = require("express");
const controller = require("../Controller/prescriptionController");
const errorValidation = require("../Middlewares/errorValidation");
const {
  validatePrescription,
  validatePatchPrescription,
  numberIdParamsValidation,
  // valiadtion module
} = require("../Middlewares/validateData");
// checkDoctor
const { authorize } = require("../Middlewares/authenticationMW");
const router = express.Router();
router
  .route("/prescription")
  .all(authorize("doctor", "admin"))
  .get(controller.getPrescription)
  .post(validatePrescription, errorValidation, controller.addPrescription);
router
  .route("/prescription/:id")
  .all(numberIdParamsValidation, errorValidation, authorize("doctor", "admin"))
  .get(controller.getPrescriptionById)
  .patch(
    validatePatchPrescription,
    errorValidation,
    controller.editPrescription
  )
  .delete(controller.removePrescription);

module.exports = router;
