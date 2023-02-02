/*** callback fns for CRUD operations ***/

/* require bcrypt */
const bcrypt = require("bcrypt");

/* Clinic Schema */
const clinicSchema = require("../Models/clinicModel");

/* require all needed modules */
const EmployeeSchema = require("./../Models/employeeModel");

/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

exports.addDoctor = async (request, response, next) => {
  try {
    const hash = await bcrypt.hash(request.body.password, 10);
    const doctor = new doctorSchema({
      ...request.body,
      password: hash,
    });
    const existingClinics = await clinicSchema.find({}, { id: 1 });
    const sentClinics = request.body.clinic;
    sentClinics.forEach((sntClinic) => {
      if (!existingClinics.find((extClinic) => extClinic._id == sntClinic)) {
        return response
          .status(400)
          .json({ message: `No such record for id: ${sntClinic}` });
      }
    });
    await doctor.save();
    response
      .status(201)
      .json({ message: "Doctor created successfully.", doctor });
  } catch (error) {
    next(error);
  }
};

// Add a new Employee
exports.addEmployee = async (request, response, next) => {
  try {
    const existingClinics = await clinicSchema.find({}, { id: 1 });
    const sentClinic = request.body.clinicId;
    if (!existingClinics.find((extClinic) => extClinic._id == sentClinic)) {
      return response
        .status(400)
        .json({ message: `No such clinic record for id: ${sentClinic}` });
    }
    const hash = await bcrypt.hash(request.body.password, 10);
    const employee = new EmployeeSchema({
      ...request.body,
      password: hash,
    });
    await employee.save();
    response
      .status(201)
      .json({ message: "Employee created successfully.", employee });
  } catch (error) {
    next(error);
  }
};

// Edit a Employee
exports.editEmployee = async (request, response, next) => {
  try {
    const employee = await EmployeeSchema.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    );
    response
      .status(200)
      .json({ message: "Employee updated successfully.", employee });
  } catch (error) {
    next(error);
  }
};

// Remove a Employee
exports.removeEmployee = async (request, response, next) => {
  try {
    const employee = await EmployeeSchema.findByIdAndDelete(
      request.params.id || request.body.id
    );
    if (!employee) {
      return next(new Error("Employee not found"));
    }
    response
      .status(201)
      .json({ message: "Employee removed successfully.", employee });
  } catch (error) {
    next(error);
  }
};

//get all Employees
exports.getEmployees = async (request, response, next) => {
  try {
    let Employees = await filterData(EmployeeSchema, request.query);
    Employees = sortData(Employees, request.query);
    Employees = paginateData(Employees, request.query);
    Employees = sliceData(Employees, request.query);

    response.status(200).json(Employees);
  } catch (error) {
    next(error);
  }
};

// Get a employee by ID
exports.getEmployeeById = async (request, response, next) => {
  try {
    const employee = await EmployeeSchema.findById(request.params.id);
    if (!employee) {
      return next(new Error("employee not found"));
    }
    response.status(200).json(employee);
  } catch (error) {
    next(error);
  }
};
