const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const users = require("../Models/usersModel");
exports.login = async (request, response, next) => {
  try {
    let token;
    const { email, password } = request.body;
    const foundUser = await users.findOne({
      _email: email,
    });
    if (foundUser) {
      const isMatch = await bcrypt.compare(password, foundUser._password);
      if (isMatch) {
        switch (foundUser._role) {
          case "admin": {
            token = jwt.sign(
              {
                role: "admin",
                email,
                id: foundUser._idInSchema,
                forClinic: foundUser._forClinic,
              },
              process.env.SECRET_KEY,
              { expiresIn: "1h" }
            );
            return response
              .status(200)
              .json({ message: "Admin login successful", token });
          }
          case "doctor": {
            token = jwt.sign(
              { role: "doctor", email, id: foundUser._idInSchema },
              process.env.SECRET_KEY,
              { expiresIn: "1h" }
            );
            return response
              .status(200)
              .json({ message: "Doctor login successful", token });
          }
          case "employee": {
            token = jwt.sign(
              { role: "employee", email, id: foundUser._idInSchema },
              process.env.SECRET_KEY,
              { expiresIn: "1h" }
            );
            return response
              .status(200)
              .json({ message: "Employee login successful", token });
          }
          case "patient": {
            token = jwt.sign(
              { role: "patient", email, id: foundUser._idInSchema },
              process.env.SECRET_KEY,
              { expiresIn: "1h" }
            );
            return response
              .status(200)
              .json({ message: "Patient login successful", token });
          }
        }
      } else {
        return response.status(200).json({ message: "Invalid Password" });
      }
    } else {
      return next(new Error("Invalid Credentials"));
    }
  } catch (error) {next(error);}
};
