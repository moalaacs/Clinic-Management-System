const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const personSchema = require("./personModel");

/*** crete schema for doctors collection ***/
const doctorSchema = new mongoose.Schema(
  Object.assign({}, personSchema.obj, {
    _id: { type: Number },
    _specilization: {
      type: String,
      required: true,
      enum: [
        "Pediatrician",
        "Gynecologist",
        "Cardiologist",
        "Dermatologist",
        "Psychiatrist",
        "Neurologist",
        "Radiologist",
        "Dentist",
        "Surgeon",
      ],
    },
    _schedule: [
      {
        day: { type: Number, required: true, min: 0, max: 6 }, //Sunday = 0, Monday = 1
        startDate: { type: Number, min: 8, max: 24, required: true },
        endDate: { type: Number, min: 8, max: 24, required: true },
      },
    ],
    _clinic: {
      type: Number,
      required: true,
      ref: "clinic",
    },
    _appointments: [
      {
        type: Number,
        required: true,
        ref: "clinic",
      },
    ],
  })
);
/*** auto increment for _id field ***/
doctorSchema.plugin(AutoIncrement, {
  id: "doctor_seq",
  inc_field: "_id",
  start_seq: 100,
});

/*** mapping schema bind collection  ***/
module.exports = mongoose.model("doctor", doctorSchema);
