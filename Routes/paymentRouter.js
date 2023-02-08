const express = require("express");
const controller = require("../Controller/paymentController");
const errorValidation = require("../Middlewares/errorValidation");
const {
  validatePayment,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authorizationMW");


const router = express.Router();

router.route("/pay/:id").post(authorizationMW.checkPatient,validatePayment, errorValidation, controller.addPayment);


// const validateInvoiceId = async (req, res, next) => {
//   const invoice_id = req.params.id;
//   const invoice = await Invoice.findOne({ _id: invoice_id });
//   if (!invoice) {
//     return res.status(400).send({ error: "Invoice not found" });
//   }
//   next();
// };



module.exports = router;
