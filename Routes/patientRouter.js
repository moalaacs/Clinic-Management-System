const express = require("express");
const controller = require("../Controller/patientController");
const errorValidation = require("../Middlewares/errorValidation");
const { validatePatientData, validateNewPatientData, numberIdParamsValidation } = require("../Middlewares/validateData")
const authorizationMW = require("../Middlewares/authenticationMW");

const router = express.Router();

router.route("/patients")
  .all(authorizationMW.checkAdmin)
  .get(controller.getPatients)
  .post(validateNewPatientData, errorValidation, controller.addPatient)


router.route("/patients/:id")
  .all(authorizationMW.checkPatient, numberIdParamsValidation)
  .get(controller.getPatientById)
  .patch(validatePatientData, errorValidation, controller.editPatient)

router.route("/patients/:id")
  .all(authorizationMW.checkAdmin, numberIdParamsValidation)
  .get(controller.getPatientById)
  .patch(validatePatientData, errorValidation, controller.editPatient)
  .delete(controller.removePatient);



module.exports = router;



