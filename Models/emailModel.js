const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const validator = require("mongoose-validator");
const emailValidator = [
  validator({
    validator: "isEmail",
    message: "Email should be in the format of example@domain.com",
  }),
];
const emailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: [true, "This email is already in use"],
    },
  },
  { _id: false }
);

emailSchema.plugin(uniqueValidator);
emailSchema.index({ email: 1 }, { unique: true, dropDups: true });
module.exports = emailSchema;
