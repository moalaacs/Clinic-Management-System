/*** callback fns for CRUD operations ***/

/* require all needed modules */
const invoiceSchema = require("../Models/invoiceModel");

/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

//get all invoices
exports.getInvoices = async (request, response, next) => {
  try {
    let invoice = await filterData(invoiceSchema, request.query);
    invoice = sortData(invoice, request.query);
    invoice = paginateData(invoice, request.query);
    invoice = sliceData(invoice, request.query);
    response.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
};

// Add a new invoice
exports.addInvoice = async (request, response, next) => {
  let addedInvoice = invoiceSchema({
    patientId: request.body.patientId,
    doctorId: request.body.doctorId,
    clinicId: request.body.clinicId,
    paymentMethod: request.body.paymentMethod,
    creationDay: request.body.creationDay,
    services: request.body.services,
    noServices: request.body.noServices,
    totalDue: request.body.totalDue,
    paid: request.body.paid,
    last: request.body.last,
  });
  try {
    await addedInvoice.save();
    response.status(200).json({ status: "Invoice Added" });
  } catch (error) {
    next(error);
  }
};

// Edit a invoice
exports.editInvoice = async (request, response, next) => {
  try {
    const invoice = await invoiceSchema.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    );
    response
      .status(200)
      .json({ message: "invoice updated successfully.", invoice });
  } catch (error) {
    next(error);
  }
};

// Remove a invoice
exports.removeInvoice = async (request, response, next) => {
  try {
    const invoice = await invoiceSchema.findByIdAndDelete(
      request.params.id || request.body.id
    );
    if (!invoice) {
      return next(new Error("invoice not found"));
    }
    response
      .status(201)
      .json({ message: "Invoice removed successfully.", invoice });
  } catch (error) {
    next(error);
  }
};

// Get a invoice by ID
exports.getInvoiceById = async (request, response, next) => {
  try {
    const invoice = await invoiceSchema.findById(request.params.id);
    if (!invoice) {
      return next(new Error("invoice not found"));
    }
    response.status(200).json({ invoice });
  } catch (error) {
    next(error);
  }
};

// const easyinvoice = require("easyinvoice");
// const fs = require("fs");
// const path = require("path")

// // IMAGE PATH
// let imgPath = path.resolve('images', 'invoice.png');
// // Function to encode file data to base64 encoded string
// function base64_encode(imgPath) {
// // read binary data
// let png = fs.readFileSync(imgPath);
// // convert binary data to base64 encoded string
// return new Buffer.from(png).toString('base64');
// };
// // DATA OBJECT
// let data = {
// //"documentTitle": "RECEIPT", //Defaults to INVOICE
// "currency": "EUR",
// "taxNotation": "vat", //or gst
// "marginTop": 25,
// "marginRight": 25,
// "marginLeft": 25,
// "marginBottom": 25,
// "logo": `${base64_encode(imgPath)}`, //or base64
// //"logoExtension": "png", //only when logo is base64
// "sender": {
// "company": "Buy Me A Gradient",
// "address": "Corso Italia 13",
// "zip": "1234 AB",
// "city": "Milan",
// "country": "IT"
// //"custom1": "custom value 1",
// //"custom2": "custom value 2",
// //"custom3": "custom value 3"
// },
// "client": {
//     "company": "Client Corp",
//     "address": "Clientstreet 456",
//     "zip": "4567 CD",
//     "city": "Clientcity",
//     "country": "Clientcountry"
// //"custom1": "custom value 1",
// //"custom2": "custom value 2",
// //"custom3": "custom value 3"
// },
// "invoiceNumber": "2020.0001",
// "invoiceDate": "05-01-2020",
// "products": [
// {
//     "quantity": "2",
//     "description": "Test1",
//     "tax": 6,
//     "price": 33.87
// },
// {
//     "quantity": "4",
//     "description": "Test2",
//     "tax": 21,
//     "price": 10.45
// }
// ],
// "bottomNotice": "Kindly pay your invoice within 15 days."
// };

// // INVOICE PDF FUNCTION
// const invoicePdf = async ()=>{
// //Create your invoice! Easy!
// let result = await easyinvoice.createInvoice(data);
// fs.writeFileSync(`./invoices/invoice${Date.now()}.pdf`, result.pdf, 'base64');
// }
// invoicePdf();
