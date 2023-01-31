/**** Import modules *****/
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

/**** Import Routes *****/
const authenticate = require("./Routes/authRouter");
const authorizationMW = require("./Middlewares/authenticationMW");
const patientRouter = require("./Routes/patientRouter");
const doctorRouter = require("./Routes/doctorRouter");
const employeeRouter = require("./Routes/employeeRouter");

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

// b- body parser middleware
app.use(express.json());

// c- Routes (End points)  middleware

/*Authenticate user */
app.use(authenticate);
/*Authorization user */
app.use(authorizationMW);

/*Routes*/
app.use(patientRouter);
app.use(doctorRouter);
app.use(employeeRouter);

// d- file not found middleware
app.use((request, response) => {
  response.status(404).json({ data: "Page Not Found 404" });
});

// e- Error handling middleware
app.use((error, request, response) => {
  let errorStatus = error.status || 500;
  response.status(errorStatus).json({ message: "Error " + error });
});
