const { check, param } = require("express-validator");

/** validation for patient data using express validator **/

let validatePerson = [
  check("_id").optional().isNumeric().withMessage("Id should be a number"),
  check("fname")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("Name should be a string and contain only letters and spaces")
    .isLength({ min: 3 })
    .withMessage("length of name should be greater than 3 characters"),
  check("lname")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("Name should be a string and contain only letters and spaces")
    .isLength({ min: 3 })
    .withMessage("length of name should be greater than 3 characters"),
  check("age").isNumeric().withMessage("Age should be a number"),
  check("gender")
    .isIn(["male", "female"])
    .withMessage("gender must be either male or female"),
  check("contactNumber")
    .matches(/^01[0125](\-)?[0-9]{8}$/)
    .withMessage("Contact number should be a number"),
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
let validatePatchPerson = [
  check("_id").optional().isNumeric().withMessage("Id should be a number"),
  check("fname")
    .optional()
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("Name should be a string and contain only letters and spaces")
    .isLength({ min: 3 })
    .withMessage("length of name should be greater than 3 characters"),
  check("lname")
    .optional()
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("Name should be a string and contain only letters and spaces")
    .isLength({ min: 3 })
    .withMessage("length of name should be greater than 3 characters"),
  check("age").optional().isNumeric().withMessage("Age should be a number"),
  check("gender")
    .optional()
    .isIn(["male", "female"])
    .withMessage("gender must be either male or female"),
  check("contactNumber")
    .optional()
    .matches(/^01[0125](\-)?[0-9]{8}$/)
    .withMessage("Contact number should be a number"),
  check("email")
    .isEmail()
    .optional()
    .withMessage("email should be in form example@example.com"),
  check("password")
    .optional()
    .isStrongPassword()
    .withMessage("password should be strong"),
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
let validatePatient = [
  validatePerson,
  check("medicalHistory")
    .optional()
    .isString()
    .withMessage("medical history should be a string"),
];
let validatePatchPatient = [
  validatePatchPerson,
  check("medicalHistory")
    .optional()
    .isString()
    .withMessage("medical history should be a string"),
];
let doctorValidation = [
  validatePerson,
  check("specilization").isString().withMessage("Specilization must be string"),
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
];
let doctorPatchValidation = [
  validatePatchPerson,
  check("specilization")
    .optional()
    .isString()
    .withMessage("Specilization must be string"),
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
];
let numberIdBodyValidation = [
  check("id").isInt().withMessage("ID must be number"),
];
let numberIdParamsValidation = [
  param("id").isInt().withMessage("ID must be number"),
];
let employeeValidation = [
  validatePerson,
  check("salary").isInt().withMessage("salary should be number"),
  check("workingHours").isInt().withMessage("workingHours should be number"),
  check("image").isString().withMessage("image should be string"),
];
let employeePatchValidation = [
  validatePatchPerson,
  check("salary").optional().isInt().withMessage("salary should be number"),
  check("workingHours")
    .optional()
    .isInt()
    .withMessage("workingHours should be number"),
  check("image").optional().isString().withMessage("image should be string"),
];
let medicineValidation = [
  check("name").isString().withMessage("Name should be a string"),
  check("productionDate")
    .isString()
    .withMessage("Production Date should be a string"),
  check("expiryDate").isString().withMessage("Expiry Date should be a string"),
  check("leaflet")
    .isString()
    .withMessage("Medicine Leaflet should be a string"),
  check("price").isInt().withMessage("Medicine Price should be a Number"),
  check("quantity").isInt().withMessage("Medicine Price should be a Number"),
];
let medicinePatchValidation = [
  check("name").optional().isString().withMessage("Name should be a string"),
  check("productionDate")
    .optional()
    .isString()
    .withMessage("Production Date should be a string"),
  check("expiryDate")
    .optional()
    .isString()
    .withMessage("Expiry Date should be a string"),
  check("leaflet")
    .optional()
    .isString()
    .withMessage("Medicine Leaflet should be a string"),
  check("price")
    .optional()
    .isInt()
    .withMessage("Medicine Price should be a Number"),
  check("quantity")
    .optional()
    .isInt()
    .withMessage("Medicine Price should be a Number"),
];

let validateAppointment = [
  check("patientId").isNumeric().withMessage("Patient Id should be a number"),
  check("doctorId").isNumeric().withMessage("Doctor Id should be a number"),
  check("date")
    .matches(
      /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
    )
    .withMessage("Invalid date format, should be DD/MM/YYYY"),
  check("time")
    .matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid time format, should be in the form 00:00"),
  check("status")
    .optional()
    .isIn(["Pending", "Accepted", "Declined", "Completed"])
    .withMessage("Invalid appointment status"),
];

let validatePatchAppointment = [
  check("patientId")
    .optional()
    .isNumeric()
    .withMessage("Patient Id should be a number"),
  check("doctorId")
    .optional()
    .isNumeric()
    .withMessage("Doctor Id should be a number"),
  check("date")
    .optional()
    .matches(
      /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
    )
    .withMessage("Invalid date format, should be DD/MM/YYYY"),
  check("time")
    .optional()
    .matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid time format, should be in the form 00:00"),
  check("status")
    .optional()
    .isIn(["Pending", "Accepted", "Declined", "Completed"])
    .withMessage("Invalid appointment status"),
];

module.exports = {
  validatePatient,
  validatePatchPatient,
  doctorValidation,
  doctorPatchValidation,
  employeeValidation,
  employeePatchValidation,
  numberIdBodyValidation,
  numberIdParamsValidation,
  medicineValidation,
  medicinePatchValidation,
  validateAppointment,
  validatePatchAppointment,
};
