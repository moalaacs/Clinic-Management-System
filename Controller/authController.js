const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("./../Models/adminModel");
const Patient = require("../Models/patientModel");
const Employee = require("../Models/employeeModel");

exports.login = async (request, response, next) => {
  let token;
  try {
    const { username, password } = request.body;
    const isAdmin = await Admin.findOne({
      username: username,
      password: password,
    });
    if (isAdmin) {
      token = jwt.sign(
        { role: "admin", username: username, id: isAdmin._id },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      response.status(200).json({ message: "Admin login successful", token });
    } else {
      const isPatient = await Patient.findOne({ email: email });
      if (isPatient) {
        const isMatch = await bcrypt.compare(password, isPatient.password);
        if (isMatch) {
          token = jwt.sign(
            { role: "patient", email: email, id: isPatient._id },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
          );
          response
            .status(200)
            .json({ message: "Patient login successful", token });
        } else {
          return next(new Error("Invalid Credentials"));
        }
      } else {
        const isEmployee = await Employee.findOne({ email: email });
        if (isEmployee) {
          const isMatch = await bcrypt.compare(password, isEmployee.password);
          if (isMatch) {
            token = jwt.sign(
              { role: "employee", email: email, id: isEmployee._id },
              process.env.SECRET_KEY,
              { expiresIn: "1h" }
            );
            response
              .status(200)
              .json({ message: "Employee login successful", token });
          } else {
            return next(new Error("Invalid Credentials"));
          }
        } else {
          return next(new Error("Invalid Credentials"));
        }
      }
    }
  } catch (error) {
    next(error);
  }
};
