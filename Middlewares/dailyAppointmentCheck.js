const doctorModel = require("../Models/doctorModel");
const appointmentModel = require("../Models/appointmentModel");

module.exports = async () => {
  return db.appointments
    .find()
    .limit(1)
    .sort({ $natural: -1 })
    .then((data) => console.log(data));
};
