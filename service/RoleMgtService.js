'use strict';
const moment = require('moment');
const RoleInfo = require('../model/RoleInfo');
const IDGen = require('../utils/IDGenerator');
const checkbody = require('../utils/CheckBody');
const {
    responseSuccess,
    responseError
} = require('../utils/Response');

exports.listRole = async () => {
    try {
        return {
            "role_list": await RoleInfo.find({}, {
                "_id": 0,
                "__v": 0
            }).lean().exec()
        };
    } catch (e) {
        return responseError(502, e);
    }
}

exports.findOneRole = async (role_id) => {
    console.log('find one');
    try {
        let result = await RoleInfo.findOne({
            role_id: role_id
        }, {
            "_id": 0,
            "__v": 0
        }).lean().exec();

        return result ? result : responseError(502, "Item not found.");
    } catch (e) {
        return responseError(502, e);
    }
}

exports.createRole = async (body) => {
    
    const require_params = ["role_name", "permission_settings"];

    const checkrequest = checkbody(require_params, body);
    if (!checkrequest.status)
        return responseError(502, checkrequest.status_msg);

    var newitem = {
        "role_id": IDGen.genIdInUUIDForm(),
        "role_name": body.role_name,
        "display_name": body.display_name ? body.display_name : null,
        "description": body.description ? body.description : null,
        "active_status": body.active_status ? body.active_status : null,
        "used": body.used ? body.used : 0,
        "num_of_users": body.num_of_users ? body.num_of_users : 0,
        "permission_settings": body.permission_settings
    };

    try {
        await RoleInfo.create(newitem).exec();
        return responseSuccess("Create success.", { ...newitem,
            "created_time": moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        });
    } catch (e) {
        return responseError(502, e);
    }
}

exports.updateRole = async (ctx) => {
    //console.log('update');
    const body = ctx.request.body.fields || ctx.request.body;
    const role_id = ctx.params.role_id;

    try {
        let result = await RoleInfo.findOneAndUpdate({
            "role_id": role_id
        }, body, {
            new: true,
            fields: {
                "_id": 0,
                "__v": 0
            }
        }).exec();
        return responseSuccess("Update Success.", { ...result._doc,
            "updated_time": moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        });
    } catch (e) {
        return responseError(502, e);
    }
}

exports.removeOneRole = async (role_id) => {
    try {
        let role = {
            "role_id": role_id
        };
        await RoleInfo.deleteOne(role).exec();
        return responseSuccess("Delete Success", {
            ...role,
            "updated_time": moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        });
    } catch (e) {
        return responseError(502, e);
    }
}