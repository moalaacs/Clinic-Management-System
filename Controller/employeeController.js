const Employee = require("./../Models/employeeModel");

exports.getAllEmployees = (request, response, next) => {
  Employee.find({})
    .then((data) => {
      response.status(200).json({ message: "get all employees", data: data });
    })
    .catch((error) => {
      next(error);
    });
};
exports.addEmployee = (request, response, next) => {
  let employeeObject = new Employee({
    name: request.body.name,
    mobileNumber: request.body.mobileNumber,
    clinicId: request.body.clinicId,
    salary: request.body.salary,
    email: request.body.email,
    address: request.body.address,
    workingHours: request.body.workingHours,
    userName: request.body.userName,
    password: request.body.password,
    image: request.body.image,
  });
  employeeObject
    .save()
    .then(() => {
      response.status(200).json({ message: "add employee" });
    })
    .catch((error) => {
      next(error);
    });
};
exports.updateEmployee = (request, response, next) => {
  Employee.updateOne(
    { _id: request.params.id },
    {
      $set: { name: request.body.name },
    }
  )
    .then(() => {
      response.status(200).json({ message: "update employee" });
    })
    .catch((error) => {
      next(error);
    });
};
exports.deleteEmployee = (request, response) => {
  Employee.deleteOne({
    _id: request.params.id,
  })
    .then((result) => {
      response.status(200).json({ message: "deleted" });
    })
    .catch((error) => next(error));
};
