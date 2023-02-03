const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const personSchema = require("./personModel");

/*** crete schema for employees collection ***/

const employeeSchema = new mongoose.Schema(
  Object.assign(personSchema.obj, {
    _id: { type: Number },
    clinicId: { type: Number, ref: "clinics" },
    salary: { type: Number },
    workingHours: { type: Number, min: 0, max: 24 },
  })
);

/*** auto increment for _id field ***/
employeeSchema.plugin(AutoIncrement, {
  id: "employee_seq",
  inc_field: "_id",
  start_seq: 1000,
});

/*** mapping schema bind collection  ***/
module.exports = mongoose.model("employees", employeeSchema);
