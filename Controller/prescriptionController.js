const prescroptionSchema = require('../Models/prescriptionModel');
const patientSchema = require('../Models/patientModel');
const doctorSchema = require('../Models/doctorModel');
const clinicSchema = require('../Models/clinicModel');


/* require helper functions (filter,sort,slice,paginate) */
const {
    filterData,
    sortData,
    sliceData,
    paginateData,
} = require("../helper/helperfns");

//get all Prescription
exports.getPrescription = async (request, response, next) => {
    try {
        let prescription = await filterData(prescroptionSchema, request.query);
        prescription = sortData(prescription, request.query);
        prescription = paginateData(prescription, request.query);
        prescription = sliceData(prescription, request.query);
        response.status(200).json(prescription);
    } catch (error) {next(error);}
};
// Add a new prescription
exports.addPrescription = async (request, response, next) => {

    const clinic = await clinicSchema.findOne({ _id: request.body.clinic });
    if (!clinic) return response.status(400).json({ error: "Clinic not found" });
    

    const patient = await patientSchema.findOne({ _id: request.body.patient });
    if (!patient) return response.status(400).json({ error: "Patient not found" });
    

    const doctor = await doctorSchema.findOne({ _id: request.body.doctor });
    if (!doctor) return response.status(400).json({ error: "Doctor not found" });
    
    let addNewPrescription = prescroptionSchema({
    _id: request.body.id,
    clinicRef: request.body.clinic,
    patientRef: request.body.patient,
    doctorRef: request.body.doctor,
    medications: request.body.medicine,
    instructions: request.body.instructions,
    });
    try {
    await addNewPrescription.save();
    response.status(200).json({ status: "Prescription Added" });
    } catch (error) { next(error);}

};


// Edit a Prescription
exports.editPrescription = async (request, response, next) => {
    try {
        const prescription = await prescroptionSchema.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true }
        );
        response
            .status(200)
            .json({ message: "Prescription updated successfully.", prescription });
    } catch (error) {next(error);}
};


// Remove a prescription
exports.removePrescription = async (request, response, next) => {
    try {
        const prescription = await prescroptionSchema.findByIdAndDelete(request.params.id || request.body.id);
        if (!prescription) {
            return next(new Error("Prescription not found"));
        }
        response
            .status(201)
            .json({ message: "prescription removed successfully.", prescription });
    } catch (error) {next(error);}
};
// Get a prescription by ID
exports.getPrescriptionById = async (request, response, next) => {
    try {
        const prescription = await prescroptionSchema.findById(request.params.id);
        if (!prescription) { return next(new Error('prescription not found')); }
        response.status(200).json({ prescription });
    } catch (error) { next(error); }
};