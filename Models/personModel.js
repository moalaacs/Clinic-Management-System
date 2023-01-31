const mongoose = require("mongoose");
const validator = require('mongoose-validator');
const addressSchema = require("./addressModel");



/* validate data using mongoose validator */
const nameValidator = [
  validator({
    validator: 'isLength',
    arguments: [3, 10],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
  }),
  validator({
    validator: 'matches',
    arguments: /^[a-zA-Z\s]+$/,
    message: 'Name should only contain letters and spaces',
  }),
];

const emailValidator = [
  validator({
    validator: 'isEmail',
    message: 'Email should be in the format of example@domain.com'
  })
];

const phoneNumberValidator = [
  validator({
    validator: 'matches',
    arguments: /^01[0125](\-)?[0-9]{8}$/,
    message: 'phone number should only contain numbers and match the pattern: 01012345678'
  })
];



const passwordValidator = [({
  validator: value => {
    const strongPasswordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.[0-9])(?=.[!@#$%^&*])(?=.{8,})/;
    return strongPasswordRegex.test(value);
  },
  message: "Password must contain at least 8 characters, including a lowercase letter, an uppercase letter, a number and a special character."
})];


const personSchema = new mongoose.Schema({
  fname: { type: String, required: true, validate: nameValidator },
  lname: { type: String, required: true, validate: nameValidator },
  age: { type: Number, required: true, min: [18, 'Age must be at least 18'], max: [60, 'Age must be at most 60'] },
  gender: { type: String, required: true },
  contactNumber: { type: String, required: true, validate: phoneNumberValidator },
  email: { type: String, required: true, unique: true, validate: emailValidator },
  address: addressSchema,
  password: { type: String, required: true, validate: passwordValidator },
  image: { type: String, required: true }
}, { _id: false });

module.exports = personSchema;




// const ageValidator = [({
//   validator: value => {
//     return value >= 18 && value <= 60;
//   },
//   message: "Age must be between 18 and 60"
// })];

