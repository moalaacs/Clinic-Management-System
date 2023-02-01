const mongoose = require("mongoose");

/*** crete schema for admins collection ***/
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 2,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
});

/*** mapping schema bind collection  ***/
module.exports = mongoose.model("admins", adminSchema);
