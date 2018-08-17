'use strict';
const moment = require('moment');
const AccountInfo = require('../model/AccountInfo');
const {
    findOneRole
} = require('./RoleMgtService');
const IDGen = require('../utils/IDGenerator');
const checkbody = require('../utils/CheckBody');
const {
    uploadPhoto,
    deletePhoto
} = require('../utils/FileAction');
const {
    responseSuccess,
    responseError
} = require('../utils/Response');

exports.listAccount = async () => {
    try {
        return {
            "account_list": await AccountInfo.find({}, {
                "_id": 0,
                "__v": 0,
                "password": 0
            }).lean().exec()
        };
    } catch (e) {
        return responseError(500, e);
    }
}

exports.findAccountByRole = async (role_id) => {
    try {
        let result = await AccountInfo.find({
            "role_id": role_id
        }, {
            "_id": 0,
            "__v": 0,
            "password": 0
        }).lean().exec();
        return result ? result : responseError(404, "Item not found");
    } catch (e) {
        return responseError(500, e);
    }
}

exports.findOneAccount = async (user_id) => {
    //console.log('find one');
    try {
        let result = await AccountInfo.findOne({
            user_id: user_id
        }, {
            "_id": 0,
            "__v": 0,
            "password": 0
        }).lean().exec();
        return result ? result : responseError(404, "Item not found");
    } catch (e) {
        return responseError(500, e);
    }
}

exports.createAccount = async (ctxbody) => {
    const body = ctxbody.fields || JSON.parse(ctxbody);
    const require_params = ["username", "password", "email", "phone", "role_id"];

    const checkrequest = checkbody(require_params, body);
    if (!checkrequest.status)
        return responseError(400, checkrequest.status_msg);

    const role = await findOneRole(body.role_id);

    if (!role.role_name)
        return responseError(400, "Role not exist.");

    var newitem = {
        "user_id": IDGen.genIdInUUIDForm(),
        "username": body.username,
        "first_name": body.first_name ? body.first_name : null,
        "last_name": body.last_name ? body.last_name : null,
        "display_name": body.display_name ? body.display_name : null,
        "description": body.description ? body.description : null,
        "password": body.password,
        "email": body.email,
        "phone": body.phone,
        "role_id": body.role_id,
        "role_name": role.role_name,
        "active_status": 1
    };
    let photoInfo = null;
    try {
        if (ctxbody.files.photo) {
            photoInfo = await uploadPhoto(ctxbody);
        }
        await AccountInfo.create({ ...newitem,
            ...photoInfo
        });
        delete newitem.password;
        return responseSuccess("Create success.", {
            ...newitem,
            ...photoInfo,
            "created_time": moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        });
    } catch (e) {
        if (photoInfo)
            await deletePhoto(photoInfo.photo_filename);
        return responseError(500, e);
    }
}
// role check, user_id exist check
exports.updateAccount = async (user_id, ctxbody) => {
    //console.log('update');
    const body = ctxbody.fields || JSON.parse(body);
    if (body.username)
        return responseError(401, "Unable change username.");

    let photoInfo = null;
    try {
        if (ctxbody.files.photo) {
            photoInfo = await uploadPhoto(ctxbody);
        }
        let result = await AccountInfo.findOneAndUpdate({
            "user_id": user_id
        }, { ...body,
            ...photoInfo
        }, {
            new: true,
            fields: {
                "_id": 0,
                "__v": 0,
                "password": 0
            }
        }).exec();
        return responseSuccess("Update Success.", { ...result._doc,
            ...photoInfo,
            "updated_time": moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        });
    } catch (e) {
        if (photoInfo)
            await deletePhoto(photoInfo.photo_filename);
        return responseError(500, e);
    }
}

exports.removeOneAccount = async (user_id) => {
    try {
        let user = {
            "user_id": user_id
        };
        //await AccountInfo.deleteOne(user).exec();
        //const result = await AccountInfo.findOneAndRemove(user).exec();
        const userInfo = await this.findOneAccount(user_id);
        console.log(userInfo);
        if (userInfo.active_status == 0) {
            const result = await AccountInfo.findOneAndUpdate(user, {
                "active_status": 4
            }, {
                new: true,
                fields: {
                    "_id": 0,
                    "__v": 0,
                    "password": 0
                }
            }).exec();
            if (result.photo_filename)
                await deletePhoto(result.photo_filename);
            return responseSuccess("Delete Success", {
                ...user,
                "updated_time": moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            });
        } else if (!userInfo.user_id) {
            return responseError(400, "User not found.");
        } else {
            return responseError(401, "User can't be deleted.");
        }
    } catch (e) {
        return responseError(500, e);
    }
}