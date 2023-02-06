const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

/*** crete schema for invoices collection ***/
const invoiceSchema = new mongoose.Schema({
  _id: { type: Number },
  patientId: { type: Number, required: true, ref: "patient" },
  doctorId: { type: Number, required: true, ref: "doctor" },
  clinicId: { type: Number, required: true, ref: "clinic" },
  paymentMethod: {
    type: String,
    enum: ["cash", "credit", "insurance"],
    required: true,
  },
  creationDay: { type: String, required: true },
  services: [{ type: Number, required: true }],
  noServices: { type: Number, required: true },
  totalDue: { type: Number, required: true },
  paid: { type: Number, required: true },
  last: { type: Number, required: true },
});

/*** auto increment for _id field ***/
invoiceSchema.plugin(AutoIncrement, {
  id: "invoice_seq",
  inc_field: "_id",
  start_seq: 500,
});

/*** mapping schema bind collection  ***/
module.exports = mongoose.model("invoice", invoiceSchema);
