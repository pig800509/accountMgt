'use strict';

//const moment = require('moment');
//const fileSystem = require('file-system');
//const path = require('path');
//const uuid = require('uuid');
//const AccountInfo = require('../model/AccountInfo');
const RoleInfo = require('../model/RoleInfo');
const IDGen = require('../utils/IDGenerator');
const checkbody = require('../utils/CheckBody');
//const uploadImage = require('../utils/Upload');
const {
    responseError
} = require('../utils/Response');

exports.listRole = async () => {
    try {
        return await RoleInfo.find({}, {
            "_id": 0,
            "__v": 0
        }).lean().exec();
    } catch (e) {
        return responseError(502, e);
    }
}

exports.findOneRole = async (role_id) => {
    console.log('find one');
    try {
        return await RoleInfo.findOne({
            role_id: role_id
        }, {
            "_id": 0,
            "__v": 0
        }).lean().exec();
    } catch (e) {
        return responseError(502, e);
    }
}

exports.createRole = async (body) => {
    
    //const body = ctx.request.body.fields;
    const require_params = ["role_name", "password", "email", "phone", "role_id"];

    const checkrequest = checkbody(require_params, body);
    if (!checkrequest.status)
        return responseError(502, checkrequest.status_msg);

    var newitem = {
        "role_id": IDGen.genIdInUUIDForm(),
        "role_name": body.role_name,
        "display_name": body.display_name,
        "description": body.description,
        "active_status": body.active_status,
        "used": body.used,
        "num_of_users": body.num_of_users,
        "permission_settings": body.permission_settings
    };

    try {
        return await RoleInfo.create(newitem);
    } catch (e) {
        return responseError(502, e);
    }
}

exports.updateRole = async (body) => {
    console.log('update');
    //const body = ctx.request.body;
    const role_id = ctx.params.role_id

    try {
        return await RoleInfo.findOneAndUpdate({
            "role_id": role_id
        }, body, {
            new: true,
            fields: {
                "_id": 0,
                "__v": 0
            }
        });
    } catch (e) {
        return responseError(502, e);
    }
}

exports.removeOneRole = async (role_id) => {
    try {
        await RoleInfo.deleteOne({
            "role_id": role_id
        }).exec();
    } catch (e) {
        return responseError(502, e);
    }
}