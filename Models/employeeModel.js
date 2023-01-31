const mongoose = require("mongoose");
const validator = require("mongoose-validator");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const addressSchema = require("./addressModel");

/* validate data using mongoose validator */
const emailValidator = [
  validator({
    validator: "isEmail",
    message: "Email should be a valid email",
  }),
];

const nameValidator = [
  validator({
    validator: "isLength",
    arguments: [3, 50],
    message: "Name should be between {ARGS[0]} and {ARGS[1]} characters",
  }),
  validator({
    validator: "matches",
    arguments: /^[a-zA-Z\s]+$/,
    message: "Name should only contain letters and spaces",
  }),
];

const employeeSchema = new mongoose.Schema({
  _id: Number,
  name: { type: String, required: true, validate: nameValidator },
  mobileNumber: { type: Number, validate: /^01[0125][0-9]{8}$/ },
  clinicId: { type: Number },
  salary: { type: Number, min: 2000, max: 4000 },
  workingHours: { type: Number },
  email: { type: String, required: true, validate: emailValidator },
  address: addressSchema,
  userName: { type: String, validate: /^[A-Za-z]\\w{4,14}$/ },
  password: { type: String, required: true, minLength: 8 },
  image: { type: String },
});

employeeSchema.plugin(AutoIncrement, {
  id: "employee_seq",
  inc_field: "_id",
  start_seq: 10000,
});

//set schema to employee collection
module.exports = mongoose.model("employee", employeeSchema);

/* 
username regex
The number of characters must be between 5 and 15.
The string should only contain alphanumeric characters and/or underscores (_).
The first character of the string should be alphabetic.
example =>  Geeksforgeeks_21
===========================
password regex
Min 1 uppercase letter.
Min 1 lowercase letter.
Min 1 special character.
Min 1 number.
Min 8 characters.
Max 30 characters.
example =>   050234@Hazem
===========================
mobileNumber regex
Phone length is exactly 11
Phone Prefix is with in allowed ones 010, 011, 012, 015
example =>  01009756572
*/
