'use strict';

const moment = require('moment');
//const _ = require('lodash');
//const randomString = require('randomstring');
const uuid = require('uuid');
const AccountInfo = require('../model/AccountInfo');
//const RoleInfo = require('../model/RoleInfo');
const checkbody =require('../utils/checkbody');

const responseErrMsg = (errCode, errString) => {

    var errMsg = {
        results: {
            status: 'Fail',
            status_code: '',
            status_msg: ''
        }
    };

    errMsg.results.status_msg = errString;
    errMsg.results.status_code = errCode.toString();

    return errMsg;
}

exports.listAccount = async () => {
    try {
        return await AccountInfo.find({},{"_id":0,"__v":0}).lean().exec();
    } catch (e) {
        return responseErrMsg(502, e);
    }
}

exports.findAccountByRole = async (role_id) => {
    try {
        return await AccountInfo.find({
            "role_id": role_id
        }).lean().exec();
    } catch (e) {
        return responseErrMsg(502, e);
    }
}

exports.findOneAccount = async (user_id) => {
    console.log('find one');
    try{
        return await AccountInfo.findOne({user_id:user_id},{"_id":0,"__v":0}).lean().exec();
    }
    catch(e){
        return responseErrMsg(502, e);
    }
}
/*
exports.unregisterDevice = function (device_id) {
    return new Promise(function (resolve, reject) {
        var examples = {};
        examples['application/json'] = {
            "result": {
                "status": "OK",
                "status_code": 200,
                "status_msg": "Success"
            }
        };
        if (Object.keys(examples).length > 0) {
            resolve(examples[Object.keys(examples)[0]]);
        } else {
            resolve();
        }
    });
}
*/
exports.createAccount = async (body) => {
    const require_params = [username, first_name, last_name, password, email, phone, role_id];
    let newitem = {
        "user_id": uuid.v1(),
        "username": body.username,
        "first_name": body.first_name,
        "last_name": body.last_name,
        "display_name": body.display_name,
        "description": body.description,
        "password": body.password,
        "email": body.email,
        "phone": body.phone,
        "role_id": body.role_id,
        "active_status":1
    }
    try{
        return await AccountInfo.create(newitem);
    }
    catch(e){
        return responseErrMsg(502, e);
    }

}

exports.updateAccount = async (user_id, body) => {
    console.log('update');
    try{
        return await AccountInfo.updateOne({"user_id":user_id},body);
    }
    catch(e){
        return responseErrMsg(502, e);
    }
}

exports.removeOneAccount = async (user_id) => {

}
