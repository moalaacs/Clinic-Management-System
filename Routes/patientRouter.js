const express = require("express");
const controller = require("../Controller/patientController");
const errorValidation = require("../Middlewares/errorValidation");
const {validatePatientData,validateNewPatientData} = require("../Middlewares/validateData")
const authorizationMW = require("../Middlewares/authenticationMW");

const router = express.Router();

router.route("/patients")
.all(authorizationMW.checkAdmin)
.get(controller.getPatients)
.post(validateNewPatientData,errorValidation,controller.createPatient)


router.route("/patients/:id")
.all(authorizationMW.checkPatient)
.get(validatePatientData,errorValidation,controller.getPatientById)
.patch(validatePatientData,errorValidation,controller.editPatient)

router.route("/patients/:id")
.all(authorizationMW.checkAdmin)
.get(validatePatientData,errorValidation,controller.getPatientById)
.patch(validatePatientData,errorValidation,controller.editPatient)
.delete(validatePatientData,errorValidation,controller.removePatient);



module.exports=router;



