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
    name: request.body.name,
    productionDate: request.body.productionDate,
    expiryDate: request.body.expiryDate,
    medicineLeaflet: request.body.leaflet,
    medicinePrice: request.body.price,
    medicineQuantity: request.body.quantity,
  });
  try {
    let resultData = await addedDoctor.save();
    response.status(200).json({ status: "Added" });
  } catch (error) {
    next(error);
  }
};

exports.updateMedicineById = async (request, response, next) => {
  try {
    let updatedMedicine = await medicineSchema.updateOne(
      { _id: request.params.id },
      {
        $set: {
          name: request.body.name,
          productionDate: request.body.proDate,
          expiryDate: request.body.expDate,
          medicineLeaflet: request.body.leaflet,
          medicinePrice: request.body.price,
          medicineQuantity: request.body.quantity,
        },
      }
    );
    if (!updatedMedicine)
      response.status(200).json({ status: "Medicine not found" });
    response.status(200).json({ status: "Updated", updatedMedicine });
  } catch (error) {
    next(error);
  }
}; //PUT

exports.patchMedicineById = async (request, response, next) => {
  let tempMedicine = {};
  if (request.body.name != null) {
    tempMedicine.name = request.body.name;
  }
  if (request.body.productionDate != null) {
    tempMedicine.productionDate = request.body.productionDate;
  }
  if (request.body.expiryDate != null) {
    tempMedicine.expiryDate = request.body.expiryDate;
  }
  if (request.body.leaflet != null) {
    tempMedicine.medicineLeaflet = request.body.leaflet;
  }
  if (request.body.price != null) {
    tempMedicine.medicinePrice = request.body.price;
  }
  if (request.body.clinic != null) {
    tempMedicine.clinic = request.body.clinic;
  }
  if (request.body.quantity != null) {
    tempMedicine.medicineQuantity = request.body.quantity;
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
}; //Patch

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
