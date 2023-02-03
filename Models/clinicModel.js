const mongoose = require("mongoose");
const validator = require("mongoose-validator");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const addressSchema = require("./addressModel");

/* validate data using mongoose validator */
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
const phoneNumberValidator = [
  validator({
    validator: "matches",
    arguments: /^01[0125](\-)?[0-9]{8}$/,
    message:
      "phone number should only contain numbers and match the pattern: 01012345678",
  }),
];
const emailValidator = [
  validator({
    validator: "isEmail",
    message: "Email should be in the format of example@domain.com",
  }),
];
/* crete schema for clinics collection */
const clinicSchema = new mongoose.Schema({
  _id: { type: Number },
  name: { type: String, required: true, validate: nameValidator },
  contactNumber: {
    type: String,
    required: true,
    validate: phoneNumberValidator,
  },
  email: {
    type: String,
    required: true,
    validate: emailValidator,
    unique: true,
  },
  address: addressSchema,
});

/* auto increment for _id field */
clinicSchema.plugin(AutoIncrement, {
  id: "clinic_seq",
  inc_field: "_id",
  start_seq: 1,
});

/* mapping schema bind collection */
module.exports = mongoose.model("clinics", clinicSchema);
