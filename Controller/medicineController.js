/*** callback fns for CRUD operations ***/

/* require all needed modules */
const medicineSchema = require("../Models/medicineModel");

/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

exports.getAllMedicine = async (request, response, next) => {
  try {
    let medicine = await filterData(medicineSchema, request.query);
    medicine = sortData(medicine, request.query);
    medicine = paginateData(medicine, request.query);
    medicine = sliceData(medicine, request.query);
    response.status(200).json(medicine);
  } catch (error) {
    next(error);
  }
};

exports.addMedicine = async (request, response, next) => {
  let addedDoctor = medicineSchema({
    _name: request.body.name,
    _productionDate: request.body.production,
    _expiryDate: request.body.expiry,
    _leaflet: request.body.usage,
    _pricePerUnit: request.body.price,
    _quantity: request.body.quantity,
  });
  try {
    let resultData = await addedDoctor.save();
    response.status(200).json({ status: "Added" });
  } catch (error) {
    next(error);
  }
};

exports.putMedicineById = async (request, response, next) => {
  try {
    let updatedMedicine = await medicineSchema.updateOne(
      { _id: request.params.id },
      {
        $set: {
          _name: request.body.name,
          _productionDate: request.body.production,
          _expiryDate: request.body.expiry,
          _leaflet: request.body.usage,
          _pricePerUnit: request.body.price,
          _quantity: request.body.quantity,
        },
      }
    );
    if (!updatedMedicine)
      response.status(200).json({ status: "Medicine not found" });
    response.status(200).json({ status: "Updated", updatedMedicine });
  } catch (error) {
    next(error);
  }
};

exports.patchMedicineById = async (request, response, next) => {
  let tempMedicine = {};
  if (request.body.name != null) {
    tempMedicine._name = request.body.name;
  }
  if (request.body.production != null) {
    tempMedicine._productionDate = request.body.productionDate;
  }
  if (request.body.expiry != null) {
    tempMedicine._expiryDate = request.body.expiryDate;
  }
  if (request.body.usage != null) {
    tempMedicine._leaflet = request.body.leaflet;
  }
  if (request.body.price != null) {
    tempMedicine._pricePerUnit = request.body.price;
  }
  if (request.body.quantity != null) {
    tempMedicine._quantity = request.body.quantity;
  }
  try {
    let updatedMedicine = await medicineSchema.updateOne(
      { _id: request.params.id },
      { $set: tempMedicine }
    );
    response.status(200).json("Patch Succesfully");
  } catch (error) {
    next(error);
  }
};

exports.removeMedicineById = async (request, response, next) => {
  try {
    let medicine = await medicineSchema.deleteOne({ _id: request.params.id });
    if (!medicine) response.status(200).json("Medicine not found");
    response.status(200).json("Deleted");
  } catch (error) {
    next(error);
  }
};

exports.getMedicineById = async (request, response, next) => {
  try {
    let medicine = await medicineSchema.find({ _id: request.params.id });
    if (!medicine) {
      return next(new Error("Medicine not found"));
    }
    response.status(200).json(medicine);
  } catch (error) {
    next(error);
  }
};
