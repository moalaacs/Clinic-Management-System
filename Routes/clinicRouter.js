const express = require("express");
const controller = require("../Controller/clinicController");
const errorValidation = require("../Middlewares/errorValidation");
const authorizationMW = require("../Middlewares/authenticationMW");

const router = express.Router();

router
  .route("/clinics")
  .all(authorizationMW.checkAdmin)
  // .get(controller.getClinics)
  .post(controller.createClinic);

router
  .route("/clinics/:id")
  .all(authorizationMW.checkAdmin)
  .get(controller.getClinicById)
  .patch(controller.editClinic)
  .delete(controller.removeClinic)

module.exports = router;
