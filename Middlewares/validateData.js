const { check, param } = require("express-validator");

/** validation for patient data using express validator **/

let validateNewPatientData = [
  check("_id").optional().isNumeric().withMessage("Id should be a number"),
  check("name")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("Name should be a string and contain only letters and spaces")
    .isLength({ min: 5 })
    .withMessage("length of name should be greater than 5 characters"),
  check("age").isNumeric().withMessage("Age should be a number"),
  check("gender")
    .isIn(["male", "female"])
    .withMessage("gender must be either male or female"),
  check("contactNumber")
    .isNumeric()
    .withMessage("Contact number should be a number"),
  check("medicalHistory")
    .optional()
    .isString()
    .withMessage("medical history should be a string"),
  check("password").isStrongPassword().withMessage("password should be strong"),
  check("email")
    .isEmail()
    .withMessage("email should be in form example@example.com"),
  check("address.street")
    .isString()
    .withMessage("street should be string")
    .isLength({ min: 2 })
    .withMessage("length of street should be greater than 1 character"),
  check("address.city")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("city should be string")
    .isLength({ min: 3 })
    .withMessage("length of city should be greater than 2 characters"),
  check("address.country")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("country should be string")
    .isLength({ min: 3 })
    .withMessage("length of country should be greater than 2 characters"),
  check("address.zipCode")
    .isInt()
    .withMessage("zip code should be a number")
    .isLength({ min: 5, max: 5 })
    .withMessage("length of zip code should be 5 characters"),
  check("image").isString().withMessage("image should be string"),
];
let validatePatientData = [
  check("_id").optional().isNumeric().withMessage("Id should be a number"),
  check("name")
    .optional()
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("Name should be a string and contain only letters and spaces")
    .isLength({ min: 5 })
    .withMessage("length of name should be greater than 5 characters"),
  check("age").optional().isNumeric().withMessage("Age should be a number"),
  check("gender")
    .optional()
    .isIn(["male", "female"])
    .withMessage("gender must be either male or female"),
  check("contactNumber")
    .optional()
    .isNumeric()
    .withMessage("Contact number should be a number"),
  check("medicalHistory")
    .optional()
    .isString()
    .withMessage("medical history should be a string"),
  check("password")
    .optional()
    .isStrongPassword()
    .withMessage("password should be strong"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("email should be in form example@example.com"),
  check("address.street")
    .optional()
    .isString()
    .withMessage("street should be string")
    .isLength({ min: 2 })
    .withMessage("length of street should be greater than 1 character"),
  check("address.city")
    .optional()
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("city should be string")
    .isLength({ min: 3 })
    .withMessage("length of city should be greater than 2 characters"),
  check("address.country")
    .optional()
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("country should be string")
    .isLength({ min: 3 })
    .withMessage("length of country should be greater than 2 characters"),
  check("address.zipCode")
    .optional()
    .isInt()
    .withMessage("zip code should be a number")
    .isLength({ min: 5, max: 5 })
    .withMessage("length of zip code should be 5 characters"),
  check("image").optional().isString().withMessage("image should be string"),
];
let doctorValidation = [
  check("name").isString().withMessage("Name must be string"),
  check("specilization").isString().withMessage("Specilization must be string"),
  check("phone")
    .isArray()
    .withMessage("Phone numbers must be entered as an array"),
  check("phone.*").isString().withMessage("Each phone number must be number"),
  check("clinic").isArray().withMessage("Clinics must be entered as an array"),
  check("clinic.*").isNumeric().withMessage("Each clinic Id must be number"),
  check("appointments")
    .optional()
    .isArray()
    .withMessage("Appointments must be entered as an array"),
  check("appointments.*")
    .optional()
    .isObject()
    .withMessage("Each appointment must be entered as an object"),
  check("appointments.*.dateTime")
    .optional()
    .isDate()
    .withMessage("DateTime of appointment must be date object"),
  check("appointments.*.patientId")
    .optional()
    .isNumeric()
    .withMessage("Patient Id must be Number"),
  check("email").isEmail().withMessage("Enter a valid email address"),
  check("password").isStrongPassword().withMessage("Enter strong password"),
  check("image").isString().withMessage("image url must be string"),
];
let doctorPatchValidation = [
  check("name").optional().isString().withMessage("Name must be string"),
  check("specilization")
    .optional()
    .isString()
    .withMessage("Specilization must be string"),
  check("phone")
    .optional()
    .isArray()
    .withMessage("Phone numbers must be entered as an array"),
  check("phone.*")
    .optional()
    .isString()
    .withMessage("Each phone number must be number"),
  check("clinic")
    .optional()
    .isArray()
    .withMessage("Clinics must be entered as an array"),
  check("clinic.*")
    .optional()
    .isNumeric()
    .withMessage("Each clinic Id must be number"),
  check("appointments")
    .optional()
    .isArray()
    .withMessage("Appointments must be entered as an array"),
  check("appointments.*")
    .optional()
    .isObject()
    .withMessage("Each appointment must be entered as an object"),
  check("appointments.*.dateTime")
    .optional()
    .isDate()
    .withMessage("DateTime of appointment must be date object"),
  check("appointments.*.patientId")
    .optional()
    .isNumeric()
    .withMessage("Patient Id must be Number"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Enter a valid email address"),
  check("password")
    .optional()
    .isStrongPassword()
    .withMessage("Enter strong password"),
  check("image").optional().isString().withMessage("image url must be string"),
];
let numberIdBodyValidation = [
  check("id").isInt().withMessage("ID must be number"),
];
let numberIdParamsValidation = [
  param("id").isInt().withMessage("ID must be number"),
];
let employeeValidation = [
  check("name")
    .isString()
    .withMessage("name should be string")
    .isLength({ max: 15 })
    .withMessage("length of name <15"),
  check("mobileNumber").isInt().withMessage("mobile number should be number"),
  check("clinicId").isInt().withMessage("clinicId should be number"),
  check("salary").isInt().withMessage("salary should be number"),
  check("workingHours").isInt().withMessage("workingHours should be number"),
  check("userName").isString().withMessage("userName should be string"),
  check("password").isStrongPassword().withMessage("password should be strong"),
  check("image").isString().withMessage("image should be string"),
];
let employeePatchValidation = [
  check("name")
    .optional()
    .isString()
    .withMessage("name should be string")
    .isLength({ max: 15 })
    .optional()
    .withMessage("length of name <15"),
  check("mobileNumber")
    .optional()
    .isInt()
    .withMessage("mobile number should be number"),
  check("clinicId").optional().isInt().withMessage("clinicId should be number"),
  check("salary").optional().isInt().withMessage("salary should be number"),
  check("workingHours")
    .optional()
    .isInt()
    .withMessage("workingHours should be number"),
  check("userName")
    .optional()
    .isString()
    .withMessage("userName should be string"),
  check("password")
    .optional()
    .isStrongPassword()
    .withMessage("password should be strong"),
  check("image").optional().isString().withMessage("image should be string"),
];
let medicineValidation = [
  check("name").isString().withMessage("Name should be a string"),
  check("proDate").isString().withMessage("Production Date should be a string"),
  check("expDate").isString().withMessage("Expiry Date should be a string"),
  check("leaflet")
    .isString()
    .withMessage("Medicine Leaflet should be a string"),
  check("price").isInt().withMessage("Medicine Price should be a Number"),
  check("quantity").isInt().withMessage("Medicine Price should be a Number"),
];
module.exports = {
  validatePatientData,
  validateNewPatientData,
  doctorValidation,
  doctorPatchValidation,
  employeeValidation,
  employeePatchValidation,
  numberIdBodyValidation,
  numberIdParamsValidation,
  medicineValidation,
};
