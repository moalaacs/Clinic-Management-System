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

  medicineRef: [
    {
      type: Number,
      required: [true, "Medicine is required"],
      ref: "medicine",
    },
  ],
  dateRef: {
    type: String,
    required: [true, "date is required"],
  },
});

prescroptionSchema.plugin(AutoIncrement, {
  id: "prescroption_seq",
  inc_field: "_id",
  start_seq: 20000,
});
module.exports = mongoose.model("prescroption", prescroptionSchema);
