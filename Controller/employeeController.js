/*** callback fns for CRUD operations ***/

/* require bcrypt */
const bcrypt = require("bcrypt");

/* require all needed modules */
const EmployeeSchema = require("./../Models/employeeModel");
const clinicSchema = require("../Models/clinicModel");
const users = require("../Models/usersModel");
/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

// Get all Employees
exports.getAllEmployees = async (request, response, next) => {
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

// Add a new Employee
exports.addEmployee = async (request, response, next) => {
  try {
    const sentClinics = request.body.clinic;
    const existingClinics = await clinicSchema.find({
      _id: { $in: sentClinics },
    });
    if (sentClinics.length != existingClinics.length) {
      return response.status(400).json({ message: "Check clinics id" });
    }
    const hash = await bcrypt.hash(request.body.password, 10);
    let testEmailandPhone = await users.findOne({
      $or: [
        { _email: request.body.email },
        { _contactNumber: request.body.phone },
      ],
    });
    if (testEmailandPhone) {
      if (testEmailandPhone._email == request.body.email) {
        return response.status(400).json({ message: `Email Already in use` });
      } else if (testEmailandPhone._contactNumber == request.body.phone) {
        return response
          .status(400)
          .json({ message: `Phone number Already in use` });
      }
    }
    const employee = new EmployeeSchema({
      _fname: request.body.firstname,
      _lname: request.body.lastname,
      _age: request.body.age,
      _gender: request.body.gender,
      _contactNumber: request.body.phone,
      _email: request.body.email,
      _address: request.body.address,
      _password: hash,
      _image: request.body.profileImage,
      password: hash,
      _clinic: request.body.clinic,
      _monthlyRate: request.body.salary,
      _workingHours: request.body.workingHours,
    });
    let savedEmployee = await employee.save();
    const newUser = new users({
      _id: savedEmployee._id,
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

// Full Edit an Employee
exports.putEmployee = async (request, response, next) => {
  try {
    const sentClinics = request.body.clinic;
    const existingClinics = await clinicSchema.find({
      _id: { $in: sentClinics },
    });
    if (sentClinics.length != existingClinics.length) {
      return response.status(400).json({ message: "Check clinics id" });
    }
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
    const updatedEmployee = await EmployeeSchema.updateOne(
      { _id: request.params.id },
      {
        $set: {
          _fname: request.body.firstname,
          _lname: request.body.lastname,
          _age: request.body.age,
          _gender: request.body.gender,
          _contactNumber: request.body.phone,
          _email: request.body.email,
          _address: request.body.address,
          _password: hash,
          _image: request.body.profileImage,
          password: hash,
          _clinics: request.body.clinic,
          _monthlyRate: request.body.salary,
          _workingHours: request.body.workingHours,
        },
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

// Edit an Employee
exports.patchEmployee = async (request, response, next) => {
  try {
    let tempEmployee = {};
    if (request.body.firstname) {
      tempPatient._fname = request.body.firstname;
    }
    if (request.body.lastname) {
      tempPatient._lname = request.body.lastname;
    }
    if (request.body.phone) {
      let testPhone = await users.findOne({
        _contactNumber: request.body.phone,
      });
      if (testPhone) {
        return response
          .status(400)
          .json({ message: `Phone number Already in use` });
      }
      await users.updateOne(
        { _id: request.params.id },
        { $set: { _contactNumber: request.body.phone } }
      );
      tempDoctor._contactNumber = request.body.phone;
    }
    if (request.body.clinic) {
      const sentClinics = request.body.clinic;
      const existingClinics = await clinicSchema.find({
        _id: { $in: sentClinics },
      });
      if (sentClinics.length != existingClinics.length) {
        return response.status(400).json({ message: "Check clinics id" });
      }
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
      tempDoctor._email = request.body.email;
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
      tempEmployee._age = request.body.age;
    }
    if (request.body.salary) {
      tempEmployee._monthlyRate = request.body.salary;
    }
    if (request.body.workingHours) {
      tempEmployee._workingHours = request.body.workingHours;
    }
    await EmployeeSchema.updateOne(
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
    response
      .status(200)
      .json({ message: "Employee updated successfully.", tempEmployee });
  } catch (error) {
    next(error);
  }
};

// Get an Employee by ID
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

// Remove an Employee
exports.removeEmployeeById = async (request, response, next) => {
  try {
    const employee = await EmployeeSchema.deleteOne({ _id: request.params.id });
    if (!employee) return response.status(200).json("Employee not found");
    await users.deleteOne({ _id: request.params.id });
    response
      .status(200)
      .json({ message: "Employee removed successfully.", employee });
  } catch (error) {
    next(error);
  }
};
