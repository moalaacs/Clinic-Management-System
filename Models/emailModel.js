const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    _email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { _id: 1 }
);

module.exports = mongoose.model("email", emailSchema);
