const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);



const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cost: { type: Number, required: true },
  },
  { _id: false }
);



/*** crete schema for invoices collection ***/
const invoiceSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  patient_Id: { type: Number, required: true, ref: "patient" },
  clinic_Id: { type: Number, required: true, ref: "clinic" },
  services: [serviceSchema],
  total: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true,
    default: (new Date()).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    })
  }


    // doctorId: { type: Number, required: true, ref: "doctor" },
  // items: [
  //   {
  //     item: {
  //       type: String,
  //       required: true
  //     },
  //     quantity: {
  //       type: Number,
  //       required: true
  //     },
  //     price: {
  //       type: Number,
  //       required: true
  //     }
  //   }
  // ],
  // paymentMethod: {
  //   type: String,
  //   enum: ["cash", "credit", "insurance"],
  //   required: true,
  // },
  // creationDay: { type: String, required: true },
  // services: [{ type: Number, required: true }],
  // noServices: { type: Number, required: true },
  // totalDue: { type: Number, required: true },
  // paid: { type: Number, required: true },
  // last: { type: Number, required: true },
});



// invoiceSchema.pre('save', function (next) {
//   let date = new Date();
//   let month = (date.getMonth() + 1).toString().padStart(2, '0');
//   let invoiceId = `${month}-${Math.floor(Math.random() * 1000000)}`;
//   this._id = invoiceId;
//   next();
// });



/*** auto increment for _id field ***/
// invoiceSchema.plugin(AutoIncrement, {
//   id: "invoice_seq",
//   inc_field: "_id",
//   start_seq: 500,
// });
// invoiceSchema.plugin(AutoIncrement, {
//   id: 'invoice_seq',
//   prefix: `${new Date().toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}-`,
//   suffix: '',
//   start_seq: 1,
//   pad_length: 6
// });

/*** mapping schema bind collection  ***/
module.exports = mongoose.model("invoice", invoiceSchema);
