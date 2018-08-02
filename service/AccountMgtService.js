'use strict';

const moment = require('moment');
//const _ = require('lodash');
//const randomString = require('randomstring');
const uuid = require('uuid');
const AccountInfo = require('../model/AccountInfo');
//const RoleInfo = require('../model/RoleInfo');
const {
    checkbody
} = require('../utils/checkbody');
const path = require('path')
const {
    uploadFile
} = require('../utils/upload')

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

const uploadImage = async (ctx) => {
    if (ctx.request.body.files.photo) {
        let serverFilePath = path.join(__dirname, '../public/image');
        console.log(serverFilePath);
        let result = await uploadFile(ctx, {
            path: serverFilePath
        });
        return {
            "photo_filename": result.data.fileName,
            "photo_url": result.data.pictureUrl,
            "photo_preview_url": result.data.pictureUrl
        };
    } else {
        return {};
    }
}

exports.listAccount = async () => {
    try {
        return await AccountInfo.find({}, {
            "_id": 0,
            "__v": 0
        }).lean().exec();
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
    try {
        return await AccountInfo.findOne({
            user_id: user_id
        }, {
            "_id": 0,
            "__v": 0
        }).lean().exec();
    } catch (e) {
        return responseErrMsg(502, e);
    }
}

exports.createAccount = async (ctx) => {
    const body = ctx.request.body.fields;
    //console.log(body);
    /*
    const require_params = ["username", "password", "email", "phone", "role_id"];
    
    const checkrequest = checkbody(require_params, body);
    if (!checkrequest.status)
        return responseErrMsg(502, checkrequest.status_msg);
    */
    var newitem = {
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
        "active_status": 1
    };

    try {
        return await AccountInfo.create(newitem);
        //console.log(await uploadImage(ctx));

        //let photo_field = await uploadImage(ctx);
        //let result = await AccountInfo.create(newitem);
        
        //return Object.assign(result, photo_field);

    } catch (e) {
        return responseErrMsg(502, e);
    }

}

exports.updateAccount = async (ctx) => {
    console.log('update');
    const body = ctx.request.body;
    const user_id = ctx.params.user_id
    try {
        return await AccountInfo.findOneAndUpdate({
            "user_id": user_id
        }, body, {
            new: true,
            fields: {
                "_id": 0,
                "__v": 0
            }
        });
    } catch (e) {
        return responseErrMsg(502, e);
    }
}

exports.removeOneAccount = async (user_id) => {
    try {
        await AccountInfo.deleteOne({
            "user_id": user_id
        }).exec();
    } catch (e) {
        return responseErrMsg(502, e);
    }
}