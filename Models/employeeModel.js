const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const personSchema = require("./personModel");


/*** crete schema for employees collection ***/
const employeeSchema = new mongoose.Schema({
  _id: { type: Number },
  fname: personSchema.fname,
  lname: personSchema.lname,
  age: personSchema.age,
  gender: personSchema.gender,
  contactNumber: personSchema.contactNumber,
  medicalHistory: { type: String, required: false },
  email: personSchema.email,
  address: personSchema.address,
  password: personSchema.password,
  image: personSchema.image,
  clinicId: { type: Number },
  salary: { type: Number, min: 2000, max: 4000 },
  workingHours: { type: Number },
});


/*** auto increment for _id field ***/
employeeSchema.plugin(AutoIncrement, {
  id: "employee_seq",
  inc_field: "_id",
  start_seq: 10000,
});

/*** mapping schema bind collection  ***/module.exports = mongoose.model("employees", employeeSchema);

