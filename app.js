/**** Import modules *****/
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

/**** Import Routes *****/
const authenticate = require("./Routes/authRouter");
const authorizationMW = require("./Middlewares/authorizationMW");
const doctorRouter = require("./Routes/doctorRouter");
const patientRouter = require("./Routes/patientRouter");
const employeeRouter = require("./Routes/employeeRouter");
const medicineRouter = require("./Routes/medicineRouter");
const clinicRouter = require("./Routes/clinicRouter");
const appointmentRouter = require("./Routes/appointmentRouter");
const prescriptionRouter = require("./Routes/prescriptionRouter");
const invoiceRouter = require("./Routes/invoiceRouter");

require("dotenv").config();

/**** Open Server ****/
const app = express();

/**** choose port ****/
const port = process.env.PORT || 8080;

/**** Connect to DB ****/
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
    /**** server is now ready to serve  ****/
    app.listen(port, () => {
      console.log("I am listening...", port);
    });
  })
  .catch((error) => console.log("Error connecting to DB", error));

/**** Middlewares ****/

// a- logger middleware
app.use(morgan("dev"));

// upload // 
app.use('/upload', express.static('upload'));

// b- body parser middleware
app.use(express.json());

// c- Routes (End points)  middleware

/*Authenticate user */
app.use(authenticate);
/*Authorization user */
app.use(authorizationMW);

/*Routes*/
app.use(doctorRouter);
app.use(patientRouter);
app.use(employeeRouter);
app.use(medicineRouter);
app.use(clinicRouter);
app.use(appointmentRouter);
app.use(prescriptionRouter);
app.use(invoiceRouter);
// d- file not found middleware
app.use((request, response) => {
  response.status(404).json({ data: "Page Not Found 404" });
});

// e- Error handling middleware
app.use((error, request, response, next) => {
  let errorStatus = error.status || 500;
  response.status(errorStatus).json(error.message);
});
