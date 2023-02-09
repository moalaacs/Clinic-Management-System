const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/employees");
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, `employee-${Date.now()}.${extension}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
module.exports.upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
