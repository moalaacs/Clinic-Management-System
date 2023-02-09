const express = require("express");
const controller = require("../Controller/prescriptionController");
const errorValidation = require("../Middlewares/errorValidation");
const {
    validatePrescription,
    validatePatchPrescription,
    numberIdParamsValidation,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authorizationMW");
const router = express.Router();
router
    .route("/prescription")
    .all(authorizationMW.checkDoctor)
    .get(controller.getPrescription)
    .post(validatePrescription, errorValidation, controller.addPrescription);

router
    .route("/prescription/:id")
    .all(numberIdParamsValidation, errorValidation, authorizationMW.checkDoctor)
    .get(controller.getPrescriptionById)
    .patch(validatePatchPrescription, errorValidation, controller.editPrescription)
    .put(validatePrescription, errorValidation, controller.putPrescriptionById)
    .delete(controller.removePrescription);

module.exports = router;
