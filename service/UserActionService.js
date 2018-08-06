'use strict';
const moment = require('moment');
const AccountInfo = require('../model/AccountInfo');
const RoleInfo = require('../model/RoleInfo');
const checkbody = require('../utils/CheckBody');
const {
    responseSuccess,
    responseError
} = require('../utils/Response');

exports.login = async (request) => {
    const body = request.fields || request;
    
    try {
        const auth = await AccountInfo.findOne({
            "username": body.username
        });
        if (body.password === auth.password){
            
        }
        else {
            
        }
            
    } catch (e) {
        return responseError(502, e);
    }
}
/*
exports.findOneAccount = async (user_id) => {
    console.log('find one');
    try {
        let result = await AccountInfo.findOne({
            user_id: user_id
        }, {
            "_id": 0,
            "__v": 0
        }).lean().exec();
        return result ? result : responseError(502, "Item not found");
    } catch (e) {
        return responseError(502, e);
    }
}



exports.updateAccount = async (ctx) => {
    console.log('update');
    const body = ctx.request.body.fields;
    const user_id = ctx.params.user_id

    if (body.username)
        return responseError(502, "Unable change username.");

    let photoInfo = null;
    try {
        if (ctx.request.body.files.photo) {
            photoInfo = await uploadPhoto(ctx);
        }
        let result = await AccountInfo.findOneAndUpdate({
            "user_id": user_id
        }, body, {
            new: true,
            fields: {
                "_id": 0,
                "__v": 0
            }
        });
        return responseSuccess("Update Success.", { ...result._doc,
            ...photoInfo,
            "updated_time": moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        });
    } catch (e) {
        if (photoInfo.photo_filename)
            await deletePhoto(photoInfo.photo_filename);
        return responseError(502, e);
    }
}
*/