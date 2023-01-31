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

/*** crete schema for patients collection ***/
const doctorSchema = new mongoose.Schema({
  _id: { type: Number },
  name: { type: String, required: true, validate: nameValidator },
  specilization: {
    type: String,
    required: true,
  },
  mobileNumber: [
    {
      type: String,
      match: /^01[0125]{1}(\-)?[0-9]{8}$/,
      required: true,
    },
  ],
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
  address: addressSchema,
  appointments: [
    {
      dateTime: { type: Date, required: true },
      patientId: { type: Number, required: true, ref: "patient" },
    },
  ],
  email: { type: String, required: true, validate: emailValidator },
  password: { type: String, required: true, minLength: 8 },
  image: { type: String, required: true },
});

/*** auto increment for _id field ***/
doctorSchema.plugin(AutoIncrement, {
  id: "doctor_seq",
  inc_field: "_id",
  start_seq: 1000,
});

/*** mapping schema bind collection  ***/
module.exports = mongoose.model("doctor", doctorSchema);
