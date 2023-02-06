const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const prescroptionSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  clinicRef: {
    type: Number,
    required: [true, "Clinic is required"],
    ref: "clinic",
  },

  patientRef: {
    type: Number,
    required: [true, "Patient is required"],
    ref: "patient",
  },

  doctorRef: {
    type: Number,
    required: [true, "Doctor is required"],
    ref: "doctor",
  },

  // medicineRef: [
  //   {
  //     type: Number,
  //     required: [true, "Medicine is required"],
  //     ref: "medicine",
  //   },
  // ],
  medications: [{
    name: { type: String, required: true },
    dose: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: Number, required: true }
    }],
  instructions: { type: String, required: false },
  date: {type: String,required: true,  default: (new Date()).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'})},
});

prescroptionSchema.plugin(AutoIncrement, {
  id: "prescroption_seq",
  inc_field: "_id",
  start_seq: 20000,
});
module.exports = mongoose.model("prescroption", prescroptionSchema);
