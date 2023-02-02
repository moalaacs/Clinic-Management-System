const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    default: () => new Date().getTime().toString(),
  },
  patientId: {
    type: Number,
    ref: "Patient",
    required: true
  },
  doctorId: {
    type: Number,
    ref: "Doctor",
    required: true
  },
  date: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
      },
      message: "Invalid date format, should be DD/MM/YYYY"
    }
  },
  time: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return /^\d{2}:\d{2}$/.test(value);
      },
      message: "Invalid time format, should be in the form 00:00 "
    }
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
    enum: ["Pending", "Accepted", "Declined", "Completed"]
  }
});


module.exports = mongoose.model('Appointment', appointmentSchema);
