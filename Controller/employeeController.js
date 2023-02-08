/*** callback fns for CRUD operations ***/

/* require bcrypt */
const bcrypt = require("bcrypt");

/* require multer */
const multer = require("multer");

/* require all needed modules */
const employeeSchema = require("./../Models/employeeModel");
const clinicSchema = require("../Models/clinicModel");
const users = require("../Models/usersModel");

/* upload image */
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
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
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadPhoto = upload.single("photo");

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
    let Employees = await filterData(employeeSchema, query, [
      {
        path: "_clinic",
        options: { strictPopulate: false },
        select: { _id: 0, _specilization: 1, _address: 1 },
      },
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
    let clinicExists = await clinicSchema.findOne({ _id: request.body.clinic });
    if (!clinicExists)
      return response
        .status(400)
        .json({ message: `Clinic ${request.body.clinic} not found` });
    let testEmailandPhone = await users.findOne({
      $or: [
        { _email: request.body.email },
        { _contactNumber: request.body.phone },
      ],
    });
    if (testEmailandPhone) {
      if (testEmailandPhone._email == request.body.email) {
        return response.status(400).json({ message: `Email Already in use` });
      } else {
        return response
          .status(400)
          .json({ message: `Phone number Already in use` });
      }
    }
    const hash = await bcrypt.hash(request.body.password, 10);
    let now = new Date();
    let age = now.getFullYear() - request.body.dateOfBirth.split("/")[2];
    if (now.getMonth() < request.body.dateOfBirth.split("/")[1]) {
      age--;
    }
    let sentObject = {
      _fname: request.body.firstname,
      _lname: request.body.lastname,
      _dateOfBirth: request.body.dateOfBirth,
      _age: age,
      _gender: request.body.gender,
      _contactNumber: request.body.phone,
      _email: request.body.email,
      _address: request.body.address,
      _password: hash,
      _clinic: request.body.clinic,
      _monthlyRate: request.body.salary,
      _workingHours: request.body.workingHours,
    };
    if (request.file) {
      sentObject._image = request.file.path;
    }
    const employee = new employeeSchema(sentObject);
    let savedEmployee = await employee.save();
    const newUser = new users({
      _idInSchema: savedEmployee._id,
      _role: "employee",
      _email: request.body.email,
      _contactNumber: request.body.phone,
      _password: hash,
    });
    await newUser.save();
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
    let clinicExists = await clinicSchema.find({ _id: request.body.clinic });
    if (!clinicExists)
      return response
        .status(400)
        .json({ message: `Clinic ${request.body.clinic} not found` });
    let testEmailandPhone = await users.findOne({
      $or: [
        { _email: request.body.email },
        { _contactNumber: request.body.phone },
      ],
    });
    if (testEmailandPhone._email == request.body.email) {
      return response.status(400).json({ message: `Email Already in use` });
    }
    if (testEmailandPhone._contactNumber == request.body.phone) {
      return response
        .status(400)
        .json({ message: `Phone number Already in use` });
    }
    let now = new Date();
    let age = now.getFullYear() - request.body.dateOfBirth.split("/")[2];
    if (now.getMonth() < request.body.dateOfBirth.split("/")[1]) {
      age--;
    }
    let sentObject = {
      _fname: request.body.firstname,
      _lname: request.body.lastname,
      _dateOfBirth: request.body.dateOfBirth,
      _age: age,
      _gender: request.body.gender,
      _contactNumber: request.body.phone,
      _email: request.body.email,
      _address: request.body.address,
      _password: hash,
      _clinic: request.body.clinic,
      _monthlyRate: request.body.salary,
      _workingHours: request.body.workingHours,
    };
    if (request.file) {
      sentObject._image = request.file.path;
    }
    const updatedEmployee = await employeeSchema.updateOne(
      { _id: request.params.id },
      {
        $set: sentObject,
      }
    );
    await users.updateOne(
      { _id: request.params.id },
      {
        $set: {
          _email: request.body.email,
          _contactNumber: request.body.phone,
        },
      }
    );
    response
      .status(200)
      .json({ message: "Employee updated successfully.", updatedEmployee });
  } catch (error) {
    next(error);
  }
};

exports.patchEmployee = async (request, response, next) => {
  try {
    let tempEmployee = {};
    if (request.body.firstname) {
      tempEmployee._fname = request.body.firstname;
    }
    if (request.body.lastname) {
      tempEmployee._lname = request.body.lastname;
    }
    if (request.body.phone) {
      tempEmployee._contactNumber = request.body.phone;
    }
    if (request.body.clinic) {
      let clinicExists = await clinicSchema.find({ _id: request.body.clinic });
      if (!clinicExists)
        return response
          .status(400)
          .json({ message: `Clinic ${request.body.clinic} not found` });
      tempEmployee._clinics = request.body.clinic;
    }
    if (request.body.email) {
      let testEmail = await users.findOne({
        _email: request.body.email,
      });
      if (testEmail) {
        return response.status(400).json({ message: `Email Already in use` });
      }
      await users.updateOne(
        { _id: request.params.id },
        { $set: { _email: request.body.email } }
      );
      tempEmployee._email = request.body.email;
    }
    if (request.body.password) {
      const hash = await bcrypt.hash(request.body.password, 10);
      tempEmployee._password = hash;
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
    if (request.body.dateOfBirth) {
      tempEmployee._dateOfBirth = request.body.dateOfBirth;
      let now = new Date();
      let age = now.getFullYear() - request.body.dateOfBirth.split("/")[2];
      if (now.getMonth() < request.body.dateOfBirth.split("/")[1]) {
        age--;
      }
      tempEmployee._age = age;
    }
    if (request.body.salary) {
      tempEmployee._monthlyRate = request.body.salary;
    }
    if (request.file) {
      tempEmployee._image = request.file.path;
    }
    if (request.body.workingHours) {
      tempEmployee._workingHours = request.body.workingHours;
    }
    await employeeSchema.updateOne(
      { _id: request.params.id },
      { $set: tempEmployee }
    );
    if (request.body.email && request.body.phone) {
      await users.updateOne(
        { _id: request.params.id },
        {
          $set: {
            _email: request.body.email,
            _contactNumber: request.body.phone,
          },
        }
      );
    } else if (request.body.email) {
      await users.updateOne(
        { _id: request.params.id },
        { $set: { _email: request.body.email } }
      );
    } else if (request.body.phone) {
      await users.updateOne(
        { _id: request.params.id },
        { $set: { _contactNumber: request.body.phone } }
      );
    }
    esponse
      .status(200)
      .json({ message: "Employee updated successfully.", tempEmployee });
  } catch (error) {
    next(error);
  }
};

// Get a employee by ID
exports.getEmployeeById = async (request, response, next) => {
  try {
    const employee = await employeeSchema.findById(request.params.id).populate({
      path: "_clinic",
      options: { strictPopulate: false },
      select: { _id: 0, _specilization: 1, _address: 1 },
    });
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
    const employee = await employeeSchema.findByIdAndDelete(
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
    id: "_id",
    firstname: "_fname",
    lastname: "_lname",
    dateOfBirth: "_dateOfBirth",
    age: "_age",
    gender: "_gender",
    phone: "_contactNumber",
    email: "_email",
    address: "_address",
    profileImage: "_image",
    clinic: "_clinic",
    salary: "_monthlyRate",
    workingHours: "_workingHours",
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
};
