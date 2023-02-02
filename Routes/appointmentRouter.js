const express = require("express");
const controller = require("../Controller/appointmentController");
const errorValidation = require("../Middlewares/errorValidation");
const {
  validateAppointment,
  validatePatchAppointment,
  numberIdParamsValidation,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authenticationMW");

const router = express.Router();

router
  .route("/appointemts")
  .get(authorizationMW.checkAdmin,controller.getAppointments)
  .post(validateAppointment, errorValidation,authorizationMW.checkPatient, controller.addAppointment);

router
  .route("/appointemts/:id")
  .all(numberIdParamsValidation, errorValidation, authorizationMW.checkAdmin)
  .get(controller.getAppointmentById)
  .patch(validatePatchAppointment, errorValidation, controller.editAppointment)
  .delete(controller.removeAppointment);


module.exports = router;
