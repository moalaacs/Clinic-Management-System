const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const prescroptionSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: [true, "Id is required"]
    },
    clinicRef: {
        type: Number,
        required: [true, "Clinic is required"],
        ref: "clinics"
    },

    patientRef: {
        type: Number,
        required: [true, "Patient is required"],
        ref: "patients"
    },

    doctorRef: {
        type: Number,
        required: [true, "Doctor is required"],
        ref: "patients"
    },

    medicineRef: {
        type: String,
        required: [true, "Medicine is required"],
        ref: "patients"
    },
    dateRef: {
        type: String,
        required: [true, "date is required"],
        ref: "patients"
    },
});

prescroptionSchema.plugin(AutoIncrement, {
    id: "prescroption_seq",
    inc_field: "_id",
    start_seq: 20000,
});
module.exports = mongoose.model("prescroption", prescroptionSchema);
