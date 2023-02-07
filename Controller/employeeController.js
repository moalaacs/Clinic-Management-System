/*** callback fns for CRUD operations ***/

/* require bcrypt */
const bcrypt = require("bcrypt");

/* Clinic Schema */
const clinicSchema = require("../Models/clinicModel");

/* require all needed modules */
const EmployeeSchema = require("./../Models/employeeModel");
const emailSchema = require("../Models/emailModel");
/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

//get all Employees
exports.getAllEmployees = async (request, response, next) => {
  try {
    let query = reqNamesToSchemaNames(request.query);
    let Employees = await filterData(EmployeeSchema, query,[
      { path: '_clinic', options: { strictPopulate: false } },
    ]);
    Employees = sortData(Employees, query);
    Employees = paginateData(Employees, request.query);
    Employees = sliceData(Employees, request.query);

    response.status(200).json(Employees);
  } catch (error) {
    next(error);
  }
};

// Add a new Employee
exports.addEmployee = async (request, response, next) => {
  try {
    const existingClinics = await clinicSchema.find({}, { id: 1 });
    const sentClinic = request.body.clinic;
    if (!existingClinics.find((extClinic) => extClinic._id == sentClinic)) {
      return response
        .status(400)
        .json({ message: `No such clinic record for id: ${sentClinic}` });
    }
    let testEmail = await emailSchema.findOne({ _email: request.body.email });
    if (testEmail) {
      return response.status(400).json({ message: `Email Already in use` });
    } else {
      let email = new emailSchema({ _email: request.body.email });
      await email.save();
    }
    const hash = await bcrypt.hash(request.body.password, 10);
    const employee = new EmployeeSchema({
      _fname: request.body.firstname,
      _lname: request.body.lastname,
      _dateOfBirth: request.body.dateOfBirth,
      _gender: request.body.gender,
      _contactNumber: request.body.phone,
      _email: request.body.email,
      _address: request.body.address,
      _password: hash,
      _image: request.body.profileImage,
      _clinic: request.body.clinic,
      _monthlyRate: request.body.salary,
      _workingHours: request.body.workingHours,
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
exports.putEmployee = async (request, response, next) => {
  try {
    const updatedEmployee = await EmployeeSchema.updateOne(
      { _id: request.params.id },
      {
        $set: {
          _fname: request.body.firstname,
          _lname: request.body.lastname,
          _dateOfBirth: request.body.dateOfBirth,
          _gender: request.body.gender,
          _contactNumber: request.body.phone,
          _email: request.body.email,
          _address: request.body.address,
          _password: hash,
          _image: request.body.profileImage,
          _clinics: request.body.clinic,
          _monthlyRate: request.body.salary,
          _workingHours: request.body.workingHours,
        },
      }
    );
    response
      .status(200)
      .json({ message: "Employee updated successfully.", employee });
  } catch (error) {
    next(error);
  }
};

exports.patchEmployee = async (request, response, next) => {
  let tempEmployee = {};
  if (request.body.firstname) {
    tempPatient._fname = request.body.firstname;
  }
  if (request.body.lastname) {
    tempPatient._lname = request.body.lastname;
  }
  if (request.body.phone) {
    tempEmployee._contactNumber = request.body.phone;
  }
  if (request.body.clinic) {
    tempEmployee._clinics = request.body.clinic;
  }
  if (request.body.email) {
    tempEmployee._email = request.body.email;
  }
  if (request.body.password) {
    const hash = await bcrypt.hash(request.body.password, 10);
    tempEmployee._password = hash;
  }
  if (request.body.image) {
    tempEmployee._image = request.body.profileImage;
  }
  if (request.body.address) {
    if (
      request.body.address.street ||
      request.body.address.city ||
      request.body.address.country ||
      request.body.address.zipCode
    ) {
      if (request.body.address.street)
        tempClinic["_address.street"] = request.body.address.street;
      if (request.body.address.city)
        tempClinic["_address.city"] = request.body.address.city;
      if (request.body.address.country)
        tempClinic["_address.country"] = request.body.address.country;
      if (request.body.address.zipCode)
        tempClinic["_address.zipCode"] = request.body.address.zipCode;
    } else {
      return response.status(200).json({ message: `Address can't be empty` });
    }
  }
  if (request.body.gender) {
    tempEmployee._gender = request.body.gender;
  }
  if (request.body.age) {
    tempEmployee._dateOfBirth = request.body.dateOfBirth;
  }
  if (request.body.salary) {
    tempEmployee._monthlyRate = request.body.salary;
  }
  if (request.body.workingHours) {
    tempEmployee._workingHours = request.body.workingHours;
  }

  try {
    let updatedDoctor = await doctorSchema.updateOne(
      { _id: request.params.id },
      { $set: tempEmployee }
    );
    response.status(200).json("Patch Succesfully");
  } catch (error) {
    next(error);
  }
};

// Get a employee by ID
exports.getEmployeeById = async (request, response, next) => {
  try {
    const employee = await EmployeeSchema.findById(request.params.id);
    if (!employee) {
      return next(new Error("Employee not found"));
    }
    response.status(200).json(employee);
  } catch (error) {
    next(error);
  }
};

// Remove a Employee
exports.removeEmployeeById = async (request, response, next) => {
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



const reqNamesToSchemaNames = (query) => {
  const fieldsToReplace = {
    id:'_id',
    firstname: '_fname',
    lastname: '_lname',
    dateOfBirth: '_dateOfBirth',
    age: '_age',
    gender: '_gender',
    phone: '_contactNumber',
    email: '_email',
    address: '_address',
    profileImage: '_image',
    clinic: '_clinic',
    salary: '_monthlyRate',
    workingHours: '_workingHours',
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
