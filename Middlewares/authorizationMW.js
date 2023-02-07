const { ChainCondition } = require("express-validator/src/context-items");
const jwt = require("jsonwebtoken");
const { get } = require("../Models/addressModel");

module.exports = (request, response, next) => {
  try {
    const token = request.get("authorization").split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    request.userData = {
      id: decodedToken.id,
      username: decodedToken.username,
      role: decodedToken.role,
    };
  } catch (error) {
    error.status = 403;
    error.message = "You are not authorized";
    next(error);
  }
  next();
};
module.exports.checkAdmin = (request, response, next) => {
  if (request.userData.role !== "admin") {
    const error = new Error("You are not authorized to access this resource");
    error.status = 403;
    next(error);
  } else {
    next();
  }
};
module.exports.checkPatient = (request, response, next) => {
  if (
    request.userData.role == "admin" ||
    (request.userData.role == "patient" &&
      request.userData.id == request.params.id)
  ) {
    next();
  } else {
    const error = new Error("You are not authorized to access this resource");
    error.status = 403;
    next(error);
  }
};
module.exports.checkDoctor = (request, response, next) => {
  if (
    request.userData.role == "admin" ||
    (request.userData.role == "doctor" &&
      request.userData.id == request.params.id)
  ) {
    next();
  } else {
    const error = new Error("You are not authorized to access this resource");
    error.status = 403;
    next(error);
  }
};

module.exports.authorize = (...roles) => {
  return (request, response, next) => {
    console.log(roles.includes(request.userData.role));
    console.log(roles);
    if (!roles.includes(request.userData.role)) {
      const error = new Error("You are not authorized to access this resource");
      error.status = 403;
      next(error);
    }
    next();
  };
};

module.exports.checkEmployee = (request, response, next) => {
  if (
    request.userData.role == "admin" ||
    (request.userData.role == "employee" &&
      request.userData.id == request.params.id)
  ) {
    next();
  } else {
    const error = new Error("You are not authorized to access this resource");
    error.status = 403;
    next(error);
  }
};
