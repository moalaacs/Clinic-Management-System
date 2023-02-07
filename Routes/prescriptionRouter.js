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
const authorizationMW = require("../Middlewares/authenticationMW");
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
    .delete(controller.removePrescription);

module.exports = router;