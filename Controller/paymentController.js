const SECRET_KEY =
  "sk_test_51MYGCZC1E4uAr6SEQB22W2K5oa9XK5PRcjylCvcPIhVwcQaGEwqefT7QfjBGvEy8XBMAiNoFS8F1xQaKwhz3VLEc00DAJkUp0n";
const stripe = require("stripe")(SECRET_KEY);
const invoiceSchema = require("./../Models/invoiceModel");
const patientSchema = require("./../Models/patientModel");
const paymentSchema = require("./../Models/paymentModel");
/*  for test==> 4242 4242 4242 4242   */

// Add a new payment
exports.addPayment = async (request, response, next) => {
  const invoice_id = request.params.id;
  if (!invoice_id) {
    return response.status(400).send({ error: "Invoice id is required" });
  }

  let amount = request.body.amount;

  let invoice = await invoiceSchema.findOne({ _id: invoice_id });
  if (!invoice) {
    return response.status(404).send({ error: "Invoice not found" });
  }

  let patientEmail = await patientSchema.findOne({ _id: invoice.patient_Id }, {_email:1, _id:0});

  if (amount > invoice.totalDue) {
    return response.status(400).send("Amount paid exceeds total due");
  }

  const card_number = request.body.card_number;
  const exp_month = request.body.exp_month;
  const exp_year = request.body.exp_year;
  const cvc = request.body.cvc;

  const param = {};
  param.card = {
    number: card_number,
    exp_month: exp_month,
    exp_year: exp_year,
    cvc: cvc,
  };

  try {
    const token = await stripe.tokens.create(param);
    const customer = await stripe.customers.create({
      metadata: {
        card_number: card_number,
        exp_month: exp_month,
        exp_year: exp_year,
        cvc: cvc,
      },
      email: patientEmail._email,
      source: token.id,
      name: "Gautam Sharma",
      address: {
        line1: "TC 9/4 Old MES colony",
        postal_code: "110092",
        city: "Mansoura",
        state: "Delhi",
        country: "Egypt",
      },
    });
    await stripe.charges.create({
      amount: amount,
      description: "clinic service",
      currency: "USD",
      customer: customer.id,
    });
    invoice.paid += amount;
    invoice.totalDue = invoice.total - invoice.paid;
    invoice.status = invoice.paid === invoice.total ? "paid" : "partial";
    await invoice.save();
    let newPayment = paymentSchema({
      invoice_id: invoice_id,
      amount: amount,
      card_number: card_number,
      exp_month: exp_month,
      exp_year: exp_year,
      cvc: cvc,
      email: patientEmail,
    });

    await newPayment.save();

    response.send({ message: "Payment added successfully" });
  } catch (error) {
    response.status(500).send({ error: error });
  }
};
