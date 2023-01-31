const express = require("express");
const router = express.Router();
const employeeController = require("../Controllers/employeeController");
const { body, query, param, validationResult } = require("express-validator");
const validator = require("./../Middlewares/errorValidation");
const {
  employeeValidation,
  employeePatchValidation,
} = require("../Middlewares/validateData");

router
  .route("/Employees/:id?")
  .get(employeeController.getAllEmployees)
  .post(employeeValidation, validator, employeeController.addEmployee)
  .patch(employeePatchValidation, validator, employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

module.exports = router;
