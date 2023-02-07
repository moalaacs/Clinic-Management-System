/*** callback fns for CRUD operations ***/

/* require all needed modules */
const medicineSchema = require("../Models/medicineModel");
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
});
exports.uploadImage = upload.single('photo')

/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

exports.getAllMedicine = async (request, response, next) => {
  try {
    let query = reqNamesToSchemaNames(request.query);
    let medicine = await filterData(medicineSchema, query);
    medicine = sortData(medicine, query);
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
    _image: request.body.image,
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
  if (request.body.name) {
    tempMedicine._name = request.body.name;
  }
  if (request.body.production) {
    tempMedicine._productionDate = request.body.productionDate;
  }
  if (request.body.expiry) {
    tempMedicine._expiryDate = request.body.expiryDate;
  }
  if (request.body.usage) {
    tempMedicine._leaflet = request.body.leaflet;
  }
  if (request.body.price) {
    tempMedicine._pricePerUnit = request.body.price;
  }
  if (request.body.quantity) {
    tempMedicine._quantity = request.body.quantity;
  }
  try {
    let updatedMedicine = await medicineSchema.updateOne(
      { _id: request.params.id },
      { $set: tempMedicine }
    );
    response.status(200).json("Patch Succesfully",updatedMedicine);
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



const reqNamesToSchemaNames = (query) => {
  const fieldsToReplace = {
    id:'_id',
    name: '_name',
    production: '_productionDate',
    expiry: '_expiryDate',
    usage: '_leaflet',
    price: '_pricePerUnit',
    quantity: '_quantity',
      
  };

  const replacedQuery = {};
  for (const key in query) {
    let newKey = key;
    for (const replaceKey in fieldsToReplace) {
      if (key.includes(replaceKey)) {
        newKey = key.replace(replaceKey, fieldsToReplace[replaceKey]);
        break;
      }
    }
    replacedQuery[newKey] = query[key];
  }
  return replacedQuery;
}
