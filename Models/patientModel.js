const mongoose = require("mongoose");
const validator = require('mongoose-validator');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const addressSchema = require("./addressModel");


/* validate data using mongoose validator */
const nameValidator = [
  validator({
    validator: 'isLength',
    arguments: [3, 50],
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
    message: 'Email should be a valid email',
  }),
];

/*** crete schema for patients collection ***/
const patientSchema = new mongoose.Schema({
  _id: {type: Number},
  name: { type: String, required: true,validate: nameValidator},
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contactNumber: { type: Number, required: true },
  medicalHistory: { type: String, required: false },
  email: { type: String, required: true,validate: emailValidator},
  address: addressSchema,
  password: {type: String,required: true, minLength: 8},
  image: {type: String,required: true}
});

/*** auto increment for _id field ***/
patientSchema.plugin(AutoIncrement, {
  id: 'patient_seq',
  inc_field: '_id',
  start_seq: 1000
});


/*** mapping schema bind collection  ***/
module.exports = mongoose.model("patients", patientSchema);


