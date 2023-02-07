const express = require("express");
const controller = require("../Controller/invoiceController");
const errorValidation = require("../Middlewares/errorValidation");
const {
  validateInvoice,
  validatePatchInvoice,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authenticationMW");

const router = express.Router();

router
  .route("/invoice")
  .all(authorizationMW.checkDoctor)
  .get(controller.getInvoices)
  .post(validateInvoice, errorValidation, controller.addInvoice);

router
  .route("/invoice/:id")
  .all(authorizationMW.checkDoctor)
  .get(controller.getInvoiceById)
  .patch(validatePatchInvoice, errorValidation, controller.editInvoice)
  .delete(controller.removeInvoice);

module.exports = router;
