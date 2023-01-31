const {check} = require("express-validator");

/** validation for patient data using express validator **/

let validateNewPatientData = [
  check("_id").optional().isNumeric().withMessage("Id should be a number"),
  check("name").matches(/^[a-zA-Z ]+$/).withMessage("Name should be a string and contain only letters and spaces")
  .isLength({min:5}).withMessage("length of name should be greater than 5 characters"),
  check("age").isNumeric().withMessage("Age should be a number"),
  check("gender").isIn(["male", "female"]).withMessage("gender must be either male or female"),
  check("contactNumber").isNumeric().withMessage("Contact number should be a number"),
  check("medicalHistory").optional().isString().withMessage("medical history should be a string"),
  check("password").isStrongPassword().withMessage("password should be strong"),
  check("email").isEmail().withMessage("email should be in form example@example.com"),
  check("address.street").isString().withMessage("street should be string")
  .isLength({ min: 2 }).withMessage("length of street should be greater than 1 character"),
  check("address.city").matches(/^[a-zA-Z ]+$/).withMessage("city should be string")
  .isLength({ min: 3 }).withMessage("length of city should be greater than 2 characters"), 
  check("address.country").matches(/^[a-zA-Z ]+$/).withMessage("country should be string")
  .isLength({ min: 3 }).withMessage("length of country should be greater than 2 characters"), 
check("address.zipCode").isInt().withMessage("zip code should be a number").isLength({min:5, max:5}).withMessage("length of zip code should be 5 characters"),
  check("image").isString().withMessage("image should be string"),
  ]





let validatePatientData = [
  check("_id").optional().isNumeric().withMessage("Id should be a number"),
  check("name").optional().matches(/^[a-zA-Z ]+$/).withMessage("Name should be a string and contain only letters and spaces")
  .isLength({min:5}).withMessage("length of name should be greater than 5 characters"),
  check("age").optional().isNumeric().withMessage("Age should be a number"),
  check("gender").optional().isIn(["male", "female"]).withMessage("gender must be either male or female"),
  check("contactNumber").optional().isNumeric().withMessage("Contact number should be a number"),
  check("medicalHistory").optional().isString().withMessage("medical history should be a string"),
  check("password").optional().isStrongPassword().withMessage("password should be strong"),
  check("email").optional().isEmail().withMessage("email should be in form example@example.com"),
  check("address.street").optional().isString().withMessage("street should be string")
  .isLength({ min: 2 }).withMessage("length of street should be greater than 1 character"),
  check("address.city").optional().matches(/^[a-zA-Z ]+$/).withMessage("city should be string")
  .isLength({ min: 3 }).withMessage("length of city should be greater than 2 characters"), 
  check("address.country").optional().matches(/^[a-zA-Z ]+$/).withMessage("country should be string")
  .isLength({ min: 3 }).withMessage("length of country should be greater than 2 characters"), 
check("address.zipCode").optional().isInt().withMessage("zip code should be a number").isLength({min:5, max:5}).withMessage("length of zip code should be 5 characters"),
  check("image").optional().isString().withMessage("image should be string"),
  ]
  
  module.exports = {validatePatientData,validateNewPatientData};