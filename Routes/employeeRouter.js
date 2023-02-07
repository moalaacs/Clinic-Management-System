const express = require("express");
const controller = require("../Controller/employeeController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const {
  employeeValidation,
  employeePatchValidation,
  numberIdParamsValidation,
} = require("../Middlewares/validateData");
const { authorize } = require("../Middlewares/authenticationMW");

const router = express.Router();

router
  .route("/employee")
  .all(authorize("admin"))
  .get(controller.getAllEmployees)
  .post(employeeValidation, validatorMiddleware, controller.addEmployee);

router
  .route("/employee/:id")
  .all(authorize("employee"), numberIdParamsValidation, validatorMiddleware)
  .get(controller.getEmployeeById)
  .patch(
    employeePatchValidation,
    validatorMiddleware,
    controller.patchEmployee
  );

router
  .route("/employee/:id")
  .all(authorize("admin"), numberIdParamsValidation, validatorMiddleware)
  .get(controller.getEmployeeById)
  .patch(employeePatchValidation, validatorMiddleware, controller.patchEmployee)
  .delete(controller.removeEmployeeById);

module.exports = router;
