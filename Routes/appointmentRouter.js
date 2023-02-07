const express = require("express");
const controller = require("../Controller/appointmentController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const {
  validateAppointment,
  validatePatchAppointment,
  numberIdParamsValidation,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authorizationMW");

const router = express.Router();

router
  .route("/appointment")
  .get(authorizationMW.checkAdmin, controller.getAllAppointments)
  .post(
    validateAppointment,
    validatorMiddleware,
    authorizationMW.checkPatient,
    controller.addAppointment
  );

router
  .route("/appointmentReports/all")
  .get(authorizationMW.checkAdmin, controller.allAppointmentsReports);

router
  .route("/appointmentReports/daily")
  .get(authorizationMW.checkAdmin, controller.dailyAppointmentsReports);

router
  .route("/appointmentReports/patient")
  .get(authorizationMW.checkAdmin, controller.patientAppointmentsReports);

router
  .route("/appointment/:id")
  .all(
    numberIdParamsValidation,
    validatorMiddleware,
    authorizationMW.checkAdmin
  )
  .get(controller.getAppointmentById)
  .patch(
    validatePatchAppointment,
    validatorMiddleware,
    controller.patchAppointment
  )
  .delete(controller.removeAppointmentById);

module.exports = router;
