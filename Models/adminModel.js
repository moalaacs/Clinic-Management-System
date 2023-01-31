const mongoose = require("mongoose");

const validator = require('mongoose-validator');

const nameValidator = [
  validator({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
  }),
  validator({
    validator: 'matches',
    arguments: /^[a-zA-Z\s]+$/,
    message: 'Name should only contain letters and spaces',
  }),
];

/*** crete schema for admins collection ***/
const adminSchema = new mongoose.Schema({
username: {
    type: String,
    required: true,
    minLength: 2,
    validate: nameValidator,
},
password: {
  type: String,
  required: true,
  minLength: 8
}
});



/*** mapping schema bind collection  ***/
mongoose.model('admins', adminSchema);
