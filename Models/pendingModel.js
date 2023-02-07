const mongoose = require("mongoose");
// const validator = require("mongoose-validator");
require();

/*** crete schema for users collection ***/
const pendingSchema = new mongoose.Schema({
  _role: {
    type: String,
    enum: ["admin", "patient", "doctor", "employee"],
    required: true,
  },
  _email: {
    type: String,
    required: true,
    unique: true,
  },
  _contactNumber: {
    type: String,
    required: true,
    validate: phoneNumberValidator,
    unique: true,
  },
});

module.exports = mongoose.model("user", pendingSchema);
