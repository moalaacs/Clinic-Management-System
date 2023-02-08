const SECRET_KEY =
  "sk_test_51MYGCZC1E4uAr6SEQB22W2K5oa9XK5PRcjylCvcPIhVwcQaGEwqefT7QfjBGvEy8XBMAiNoFS8F1xQaKwhz3VLEc00DAJkUp0n";
const stripe = require("stripe")(SECRET_KEY);
const invoiceSchema = require("./../Models/invoiceModel");
/*  for test==> 4242 4242 4242 4242   */

// Add a new payment
exports.addPayment = async (request, response, next) => {
  /*
    const invoivce = await invoiceSchema.findOne({
        _id: request.param.id,
      });
    */

  const card_number = request.body.card_number;
  const exp_month = request.body.exp_month;
  const exp_year = request.body.exp_year;
  const cvc = request.body.cvc;
  //const total = ;
  const param = {};
  param.card = {
    number: card_number,
    exp_month: exp_month,
    exp_year: exp_year,
    cvc: cvc,
  };
  // create token
  stripe.tokens.create(param, function (err, token) {
    if (err) {
      console.log("err: " + err);
    }
    if (token) {
      // create new customer
      stripe.customers
        .create({
          metadata: {
            card_number: card_number,
            exp_month: exp_month,
            exp_year: exp_year,
            cvc: cvc,
          },
          email: request.body.patientEmail,
          source: token.id,
          name: "Gautam Sharma",
          address: {
            line1: "TC 9/4 Old MES colony",
            postal_code: "110092",
            city: "Mansoura",
            state: "Delhi",
            country: "Egypt",
          },
        })
        .then((customer) => {
          return stripe.charges.create({
            amount: 5000,
            description: "clinic servise",
            currency: "USD",
            customer: customer.id,
          });
        })
        .then((charge) => {
          response.send("Success"); // If no error occurs
        })
        .catch((err) => {
          response.send(err); // If some error occurs
        });
    } else {
      console.log("Something wrong");
    }
  });
};
