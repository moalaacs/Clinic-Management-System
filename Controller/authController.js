const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
require('./../Models/adminModel');
const bcrypt = require("bcrypt");
const Admin = mongoose.model('admins');
require('../Models/patientModel');
const Patient = mongoose.model('patients');



exports.login= async (request, response, next) => {
    let token;
    try {
        const { username, password } = request.body;
        const isAdmin = await Admin.findOne({username:username , password:password });
        if (isAdmin) {
            token = jwt.sign({role:"admin", username:username, id:isAdmin._id},  process.env.SECRET_KEY,{expiresIn: "1h"});
                response.status(200).json({message:"Admin login successful",token});
        }
        else{
            const isPatient = await Patient.findOne({name:username });
            if (isPatient) {
                const isMatch = await bcrypt.compare(password, isPatient.password);
                if (isMatch) {
                    token = jwt.sign({role:"patient", username:username,id:isPatient._id}, process.env.SECRET_KEY,{expiresIn: "1h"});
                    response.status(200).json({message:"Patient login successful",token});
                } else {return next(new Error('Invalid Credentials'));}
            }else{return next(new Error('Invalid Credentials'));}
        }
    }
    catch (error) {next(error);}    
}









