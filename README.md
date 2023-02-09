# Clinic-Management-System

## Table of Contents

* [Description](#description)
* [Requirements](#requirements)
* [Resources](#resources)
* [Tools](#tools)
* [Quick Start](#quick-start)
* [Routes](#routes)



## Description

CMS is a web-based application for managing multiple clinic’s data along with
providing common access clinic’s doctors and receptionists.
Clinic required a system to manage all the back-office team activities for their
patient’s appointment & their follow-ups. It provides doctors with their daily
schedule based on the clinic location and also allows the patient to make the
payment through Cash, Credit Card, Insurance Card etc. Part Payment can also be
handled. User can generate receipts for Insurance Company and also for the
patient. 


## Requirements

- bcrypt
- dotenv
- easyinvoice
- express
- express-validator
- fs
- jsonwebtoken
- mongoose
- mongoose-sequence
- mongoose-validator
- morgan
- multer
- nodemailer
- stripe
- validatorjs


## Resources

- https://expressjs.com/
- https://www.mongodb.com/


## Tools

- https://code.visualstudio.com/
- https://www.mongodb.com/products/compass
- https://robomongo.org/
- https://www.postman.com/


## Quick Start

  Install dependencies:

```console
$ npm install
```

  Start the database server:

```console
$ mongod
```

  Start the server:

```console
$ npm start
```


## Routes

| Routes       |
| ------------ |
|**Register**|
|`/register`|
|**Login**|
|`/login`|
|**Doctor**|
|`/doctor`|
|`/doctor/:id`|
|**Patient**|
|`/patient`|
|`/patient/:id`|
|**Employee**|
|`/employee`|
|`/employee/:id`|
|**Clinic**|
|`/clinic`|
|`/clinic/:id`|
|**Medicine**|
|`/medicine`|
|`/medicine/:id`|
|**Appointment**|
|`/appointment`|
|`/appointment/:id`|
|`/appointmentReports/all`|
|`/appointmentReports/daily`|
|`/appointmentReports/patient/:id`|
|`/appointmentReports/doctor/:id`|
|**Prescription**|
|`/prescription`|
|`/prescription/:id`|
|**Invoice**|
|`/invoice`|
|`/invoiceReports/all`|
|`/invoiceReports/daily`|
|`/invoiceReports/patient`|
|**Payment**|
|`/pay/:id`|

[List of all contributors](https://github.com/moalaacs/Clinic-Management-System/graphs/contributors)
