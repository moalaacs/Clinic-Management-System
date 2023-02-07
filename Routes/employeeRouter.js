const express = require("express");
const controller = require("../Controller/employeeController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const {
  employeeValidation,
  employeePatchValidation,
  numberIdParamsValidation,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authorizationMW");

const router = express.Router();

router
  .route("/employee")
  .all(authorizationMW.checkAdmin)
  .get(controller.getAllEmployees)
  .post(employeeValidation, validatorMiddleware, controller.addEmployee);

router
  .route("/employee/:id")
  .all(
    authorizationMW.checkEmployee,
    numberIdParamsValidation,
    validatorMiddleware
  )
  .get(controller.getEmployeeById)
  .patch(
    employeePatchValidation,
    validatorMiddleware,
    controller.patchEmployee
  );

router
  .route("/employee/:id")
  .all(
    authorizationMW.checkAdmin,
    numberIdParamsValidation,
    validatorMiddleware
  )
  .get(controller.getEmployeeById)
  .patch(employeePatchValidation, validatorMiddleware, controller.patchEmployee)
  .delete(controller.removeEmployeeById);

module.exports = router;
