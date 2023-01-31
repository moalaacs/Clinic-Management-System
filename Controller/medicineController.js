const mongoose = require("mongoose");
require("../Models/medicineModel");

const medicineSchema = mongoose.model("medicine");
/* *********************************************************** */
exports.getAllMedicine = (request, response, next) => {
  medicineSchema
    .find()
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};
/* *********************************************************** */
exports.addMedicine = (request, response, next) => {
  let newMedicine = new medicineSchema({
    name: request.body.name,
    productionDate: request.body.proDate,
    expiryDate: request.body.expDate,
    medicineLeaflet: request.body.leaflet,
    medicinePrice: request.body.price,
    medicineQuantity: request.body.quantity,
  });
  newMedicine
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => next(error));
};
/* *********************************************************** */
exports.updateMedicine = (request, response, next) => {
  medicineSchema
    .updateOne(
      {
        name: request.body.name,
      },
      {
        $set: {
          medicinePrice: request.body.price,
          medicineQuantity: request.body.quantity,
        },
      }
    )
    .then((result) => {
      response.status(200).json({ message: "Medicine Info. Updated" });
    })
    .catch((error) => next(error));
};
/* *********************************************************** */
exports.deleteMedicine = (request, response, next) => {
  teachersSchema
    .findOneAndDelete({ name: request.params.name })
    .then((data) => {
      if (data != null) {
        response.status(200).json({ message: "Medicine Deleted!" });
      } else {
        next(new Error("Medicine doesn't Exist!"));
      }
    })
    .catch((error) => next(error));
};
/* *********************************************************** */
exports.getMedicine = (request, response, next) => {
  teachersSchema
    .findOne({ name: request.params.name })
    .then((data) => {
      if (data != null) response.status(200).json(data);
      else {
        next(new Error("Medicine doesn't Exist!"));
      }
    })
    .catch((error) => next(error));
};
/* **********************z************************************* */
