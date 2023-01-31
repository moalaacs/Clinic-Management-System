const express = require("express");
const controller = require("../Controllers/employeeController");
const { body, query, param, validationResult } = require("express-validator");
const validator = require("./../Middlewares/errorValidation");

const errorValidation = require("../Middlewares/errorValidation");
const {
  employeeValidation,
  employeePatchValidation, numberIdParamsValidation
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authenticationMW");

const router = express.Router();

router.route("/employees")
  .all(authorizationMW.checkAdmin)
  .get(controller.getEmployees)
  .post(employeeValidation, errorValidation, controller.addEmployee)



router.route("/patients/:id")
  .all(authorizationMW.checkEmployee, numberIdParamsValidation)
  .get(controller.getEmployeeById)
  .patch(employeePatchValidation, errorValidation, controller.editEmployee)

router.route("/employees/:id")
  .all(authorizationMW.checkAdmin, numberIdParamsValidation)
  .get(controller.getEmployeeById)
  .patch(employeePatchValidation, errorValidation, controller.editEmployee)
  .delete(controller.removeEmployee);



module.exports = router;
