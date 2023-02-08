const express = require("express");
const controller = require("../Controller/paymentController");
const router = express.Router();

router.route("/pay").post(controller.addPayment);

module.exports = router;
