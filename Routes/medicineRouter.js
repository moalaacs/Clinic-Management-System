const express = require("express");
// const { body, query, param, validationResult } = require("express-validator");
const controller = require("./../Controller/medicineController");
// const validator = require("./../Middelwares/errorValidation");

const router = express.Router();

const validationArray = [
    body("name").isString().withMessage("Name should be a string"),
    body("proDate").isString().withMessage("Production Date should be a string"),
    body("expDate").isString().withMessage("Expiry Date should be a string"),
    body("leaflet").isString().withMessage("Medicine Leaflet should be a string"),
    body("price").isInt().withMessage("Medicine Price should be a Number"),
    body("quantity").isInt().withMessage("Medicine Price should be a Number")
]; /* Later: Outside Module */

router.route("/medicine")
    .get(controller.getAllMedicine)
    .post(validationArray, validator, controller.addMedicine)
    .patch(validationArray, validator, controller.updateMedicine)

router.delete("/medicine/:name",
    param("name").isString().withMessage("Medicine deleted successfully!"),
    validator, controller.deleteMedicine);

router.get("/medicine/:name",
    param("name").isString().withMessage("Get Medicine!"),
    validator, controller.getMedicine);


module.exports = router;
