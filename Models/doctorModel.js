const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const personSchema = require("./personModel");


/*** crete schema for doctors collection ***/
const doctorSchema = new mongoose.Schema({
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
  specilization: {
    type: String,
    required: true,
  },
  schedule: [
    {
      clinicId: {
        type: Number,
        required: true,
        ref: "clinic",
      },
      timeline: {
        day: { type: String, required: true },
        startDate: { type: Number, min: 8, max: 24, required: true },
        endDate: { type: Number, min: 8, max: 24, required: true },
      },
    },
  ],
  clinic: [
    {
      type: Number,
      required: true,
      ref: "clinic",
    },
  ],
  appointments: [
    {
      dateTime: { type: Date, required: true },
      patientId: { type: Number, required: true, ref: "patient" },
    },
  ],
});

/*** auto increment for _id field ***/
doctorSchema.plugin(AutoIncrement, {
  id: "doctor_seq",
  inc_field: "_id",
  start_seq: 1000,
});

/*** mapping schema bind collection  ***/
module.exports = mongoose.model("doctor", doctorSchema);
