const express = require("express");
const {check} = require("express-validator");
const controller = require("../Controller/authController");



const router = express.Router();

router.route("/login")
.post(
  check("username").isString().withMessage("Please enter a valid userName"),
  check("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  ,controller.login)


module.exports=router;


























