const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const personSchema = require("./personModel");

/*** crete schema for patients collection ***/
const patientSchema = new mongoose.Schema(
  Object.assign(personSchema.obj, {
    medicalHistory: { type: String },
    _id: { type: Number },
    clinicId: { type: Number, ref: "clinics" },
  })
);

/*** auto increment for _id field ***/
patientSchema.plugin(AutoIncrement, {
  id: "patient_seq",
  inc_field: "_id",
  start_seq: 1000,
});

/*** mapping schema bind collection  ***/
module.exports = mongoose.model("patients", patientSchema);
