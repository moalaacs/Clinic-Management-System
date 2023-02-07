const { check, param } = require("express-validator");

/** validation for patient data using express validator **/
let validateClinic = [
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
  check("email")
    .isEmail()
    .withMessage("email should be in form example@example.com"),
  check("phone")
    .matches(/^01[0125](\-)?[0-9]{8}$/)
    .withMessage("Contact number should be a number"),
  check("speciality")
    .isString()
    .withMessage("Speciality must be string")
    .isIn([
      "Pediatrician",
      "Gynecologist",
      "Cardiologist",
      "Oncologist",
      "Dermatologist",
      "Psychiatrist",
      "Neurologist",
      "Radiologist",
      "Dentist",
      "Surgeon",
    ])
    .withMessage("Clinic's speciality isn't available"),
];
let validatePatchClinic = [
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
  check("email")
    .optional()
    .isEmail()
    .withMessage("email should be in form example@example.com"),
  check("phone")
    .optional()
    .matches(/^01[0125](\-)?[0-9]{8}$/)
    .withMessage("Contact number should be a number"),
  check("speciality")
    .optional()
    .isString()
    .withMessage("Speciality must be string")
    .isIn([
      "Pediatrician",
      "Gynecologist",
      "Cardiologist",
      "Oncologist",
      "Dermatologist",
      "Psychiatrist",
      "Neurologist",
      "Radiologist",
      "Dentist",
      "Surgeon",
    ])
    .withMessage("Clinic's speciality isn't available"),
];
let validatePerson = [
  check("_id").optional().isNumeric().withMessage("Id should be a number"),
  check("firstname")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("Name should be a string and contain only letters and spaces")
    .isLength({ min: 3 })
    .withMessage("length of name should be greater than 3 characters"),
  check("lastname")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("Name should be a string and contain only letters and spaces")
    .isLength({ min: 3 })
    .withMessage("length of name should be greater than 3 characters"),
  check("age").isNumeric().withMessage("Age should be a number"),
  check("gender")
    .isIn(["male", "female"])
    .withMessage("gender must be either male or female"),
  check("phone")
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
  check("profileImage").isString().withMessage("image should be string"),
];
let validatePatchPerson = [
  check("_id").optional().isNumeric().withMessage("Id should be a number"),
  check("firstname")
    .optional()
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("Name should be a string and contain only letters and spaces")
    .isLength({ min: 3 })
    .withMessage("length of name should be greater than 3 characters"),
  check("lastname")
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
  check("phone")
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
  check("profileImage")
    .optional()
    .isString()
    .withMessage("image should be string"),
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
  check("speciality")
    .isString()
    .withMessage("Speciality must be string")
    .isIn([
      "Pediatrician",
      "Gynecologist",
      "Cardiologist",
      "Oncologist",
      "Dermatologist",
      "Psychiatrist",
      "Neurologist",
      "Radiologist",
      "Dentist",
      "Surgeon",
    ])
    .withMessage("Doctor's speciality isn't provided"),
];
let doctorPatchValidation = [
  validatePatchPerson,
  check("speciality")
    .isString()
    .withMessage("Speciality must be string")
    .isIn([
      "Pediatrician",
      "Gynecologist",
      "Cardiologist",
      "Oncologist",
      "Dermatologist",
      "Psychiatrist",
      "Neurologist",
      "Radiologist",
      "Dentist",
      "Surgeon",
    ])
    .withMessage("Doctor's speciality isn't available"),
];
let numberIdParamsValidation = [
  param("id").isInt().withMessage("ID must be number"),
];
let employeeValidation = [
  validatePerson,
  check("clinic").isInt().withMessage("clinicId should be number"),
  check("salary").isInt().withMessage("salary should be number"),
  check("workingHours").isInt().withMessage("workingHours should be number"),
];
let employeePatchValidation = [
  validatePatchPerson,
  check("salary").optional().isInt().withMessage("salary should be number"),
  check("workingHours")
    .optional()
    .isInt()
    .withMessage("workingHours should be number"),
];
let medicineValidation = [
  check("name").isString().withMessage("Name should be a string"),
  check("production")
    .isString()
    .withMessage("Production Date should be a string"),
  check("expiry").isString().withMessage("Expiry Date should be a string"),
  check("usage").isString().withMessage("Medicine usage should be a string"),
  check("price").isInt().withMessage("Medicine Price should be a Number"),
  check("quantity").isInt().withMessage("Medicine Price should be a Number"),
];
let medicinePatchValidation = [
  check("name").optional().isString().withMessage("Name should be a string"),
  check("production")
    .optional()
    .isString()
    .withMessage("Production Date should be a string"),
  check("expiry")
    .optional()
    .isString()
    .withMessage("Expiry Date should be a string"),
  check("usage")
    .optional()
    .isString()
    .withMessage("Medicine usage should be a string"),
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
  check("clinicId").isNumeric().withMessage("clinic Id should be a number"),
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
  check("clinicId")
    .optional()
    .isNumeric()
    .withMessage("clinic Id should be a number"),
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
  validateClinic,
  validatePatchClinic,
  validatePatient,
  validatePatchPatient,
  doctorValidation,
  doctorPatchValidation,
  employeeValidation,
  employeePatchValidation,
  numberIdParamsValidation,
  medicineValidation,
  medicinePatchValidation,
  validateAppointment,
  validatePatchAppointment,
};
