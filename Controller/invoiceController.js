/*** callback fns for CRUD operations ***/

/* require needed library to genrate invoice */
const fs = require("fs");
const easyinvoice = require("easyinvoice");

/* require all needed modules */
const invoiceSchema = require("../Models/invoiceModel");
const patientSchema = require("../Models/patientModel");
const clinicSchema = require("../Models/clinicModel");

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
    let query = reqNamesToSchemaNames(request.query);
    let invoice = await filterData(invoiceSchema, query, [
      { path: "patient_Id", options: { strictPopulate: false } },
      { path: "clinic_Id", options: { strictPopulate: false } },
    ]);
    invoice = sortData(invoice, query);
    invoice = paginateData(invoice, request.query);
    invoice = sliceData(invoice, request.query);
    response.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
};

const generateInvoiceId = () => {
  const date = new Date();
  const invoiceId = `${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${Math.floor(Math.random() * 1000000)}`;
  return invoiceId;
};

// Add a new invoice
exports.addInvoice = async (request, response, next) => {
  try {
    const clinic = await clinicSchema.findOne({ _id: request.body.clinicId });
    if (!clinic)
      return response.status(400).json({ error: "Clinic not found" });

    const patient = await patientSchema.findOne({
      _id: request.body.patientId,
    });
    if (!patient)
      return response.status(400).json({ error: "Patient not found" });
    let services = request.body.services;
    let total = 0;
    services.forEach((service) => {
      total += service.cost;
    });
    let addedInvoice = invoiceSchema({
      _id: generateInvoiceId(),
      patient_Id: request.body.patientId,
      clinic_Id: request.body.clinicId,
      services: services,
      total: total,
    });

    await addedInvoice.save();
    const date = new Date();
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    let data = {
      //"documentTitle": "RECEIPT", //Defaults to INVOICE
      currency: "USD",
      taxNotation: "vat", //or gst
      marginTop: 25,
      marginRight: 25,
      marginLeft: 25,
      marginBottom: 25,
      settings: { locale: "en-US", currency: "USD" },
      sender: {
        company: `Alwafaa-${clinic._id}`,
        address: clinic._address.street,
        zip: clinic._address.zipCode,
        city: clinic._address.city,
        country: clinic._address.country,
      },
      client: {
        company: patient._fname + " " + patient._lname,
        address: patient._address.street,
        zip: patient._address.zipCode,
        city: patient._address.city,
        country: patient._address.country,
      },

      images: {
        logo: "https://seeklogo.com/images/H/hospital-clinic-plus-logo-7916383C7A-seeklogo.com.png",
      },

      information: {
        // Invoice number
        number: addedInvoice._id,
        // Invoice data
        date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
        // Invoice due date
        "due-date": `${dueDate.getDate()}/${
          dueDate.getMonth() + 1
        }/${dueDate.getFullYear()}`,
      },
      products: addedInvoice.services.map((service) => ({
        quantity: "1",
        description: service.name,
        "tax-rate": 14,
        price: service.cost,
      })),
      "bottom-notice": "Kindly pay your invoice within 30 days.",
    };

    const invoicePdf = async () => {
      let result = await easyinvoice.createInvoice(data);
      fs.writeFile(
        `invoices/${addedInvoice._id}.pdf`,
        result.pdf,
        "base64",
        function (error) {
          if (error) {
            next(error);
          }
        }
      );
    };
    await invoicePdf();
    response
      .status(200)
      .json({
        status: "Invoice Added and Saved to File",
        invoice: addedInvoice,
      });
  } catch (error) {
    next(error);
  }
};

// Edit a invoice
exports.editInvoice = async (request, response, next) => {
  try {
    const existingInvoice = await invoiceSchema.findById(request.params.id);
    let clinic, patient;
    if (!existingInvoice) {
      return response.status(400).json({ message: "Invoice not found." });
    }

    let { clinicId, patientId, services } = request.body;
    let total = existingInvoice.total;

    if (clinicId) {
      clinic = await clinicSchema.findById(clinicId);
      if (!clinic) {
        return response.status(400).json({ message: "Clinic not found." });
      }
    } else {
      clinicId = existingInvoice.clinic_Id;
    }

    if (patientId) {
      patient = await patientSchema.findById(patientId);
      if (!patient) {
        return response.status(400).json({ message: "Patient not found." });
      }
    } else {
      patientId = existingInvoice.patient_Id;
    }

    if (services) {
      total = 0;
      services.forEach((service) => {
        total += service.cost;
      });
    } else {
      services = existingInvoice.services;
    }

    let tempInvoice = {
      clinic_Id: clinicId,
      patient_Id: patientId,
      services: services,
      total: total,
    };

    const updatedInvoice = await invoiceSchema.updateOne(
      { _id: request.params.id },
      { $set: tempInvoice }
    );
    if (!clinic) {
      clinic = await clinicSchema.findById(clinicId);
    }
    if (!patient) {
      patient = await patientSchema.findById(patientId);
    }

    fs.unlinkSync(`invoices/${existingInvoice._id}.pdf`);

    const date = new Date();
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    let data = {
      //"documentTitle": "RECEIPT", //Defaults to INVOICE
      currency: "USD",
      taxNotation: "vat", //or gst
      marginTop: 25,
      marginRight: 25,
      marginLeft: 25,
      marginBottom: 25,
      settings: { locale: "en-US", currency: "USD" },
      sender: {
        company: `Alwafaa-${clinic._id}`,
        address: clinic._address.street,
        zip: clinic._address.zipCode,
        city: clinic._address.city,
        country: clinic._address.country,
      },
      client: {
        company: patient._fname + " " + patient._lname,
        address: patient._address.street,
        zip: patient._address.zipCode,
        city: patient._address.city,
        country: patient._address.country,
      },

      images: {
        logo: "https://seeklogo.com/images/H/hospital-clinic-plus-logo-7916383C7A-seeklogo.com.png",
      },

      information: {
        // Invoice number
        number: existingInvoice._id,
        // Invoice data
        date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
        // Invoice due date
        "due-date": `${dueDate.getDate()}/${
          dueDate.getMonth() + 1
        }/${dueDate.getFullYear()}`,
      },
      products: tempInvoice.services.map((service) => ({
        quantity: "1",
        description: service.name,
        "tax-rate": 14,
        price: service.cost,
      })),
      "bottom-notice": "Kindly pay your invoice within 30 days.",
    };

    const invoicePdf = async () => {
      let result = await easyinvoice.createInvoice(data);
      fs.writeFile(
        `invoices/${existingInvoice._id}.pdf`,
        result.pdf,
        "base64",
        function (error) {
          if (error) {
            next(error);
          }
        }
      );
    };
    await invoicePdf();
    response
      .status(200)
      .json({ message: "invoice updated successfully.", updatedInvoice });
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
    console.log(invoice._id);
    fs.unlinkSync(`invoices/${invoice._id}.pdf`);
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

const reqNamesToSchemaNames = (query) => {
  const fieldsToReplace = {
    id: "_id",
    clinicId: "clinic_Id",
    patientId: "patient_Id",
    total: "total",
    services: "services",
  };

  const replacedQuery = {};
  for (const key in query) {
    let newKey = key;
    for (const replaceKey in fieldsToReplace) {
      if (key.includes(replaceKey)) {
        newKey = key.replace(replaceKey, fieldsToReplace[replaceKey]);
        break;
      }
    }
    replacedQuery[newKey] = query[key];
  }
  return replacedQuery;
};
