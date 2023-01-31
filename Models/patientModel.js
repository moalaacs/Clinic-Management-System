const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const personSchema = require("./personModel");




/*** crete schema for patients collection ***/
const patientSchema = new mongoose.Schema({
  _id: { type: Number },
  fname: personSchema.fname,
  lname: personSchema.lname,
  age: personSchema.age,
  gender: personSchema.gender,
  contactNumber: personSchema.contactNumber,
  email: personSchema.email,
  address: personSchema.address,
  password: personSchema.password,
  image: personSchema.image,
  medicalHistory: { type: String, required: false },
});

/*** auto increment for _id field ***/
patientSchema.plugin(AutoIncrement, {
  id: 'patient_seq',
  inc_field: '_id',
  start_seq: 1000
});


/*** mapping schema bind collection  ***/
module.exports = mongoose.model("patients", patientSchema);


