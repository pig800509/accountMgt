'use strict';
const moment = require('moment');
const AccountInfo = require('../model/AccountInfo');
//const RoleInfo = require('../model/RoleInfo');
const checkbody = require('../utils/CheckBody');
const {
    responseSuccess,
    responseError
} = require('../utils/Response');

exports.login = async (request) => {
    const body = request.fields || request;
    const require_params = ["username", "password"];
    const checkrequest = checkbody(require_params, body);
    if (!checkrequest.status)
        return responseError(401, checkrequest.status_msg);
    try {
        const password = await findOnePassword(body.username);
        if (password === body.password) {
            await AccountInfo.findOneAndUpdate({
                "username": body.username
            },{"online":true}).exec();
            return responseSuccess("Login Success", {
                "username": body.username,
                "updated_time": moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            });
        } else {
            return responseError(401, "Wrong username or password.");
        }

    } catch (e) {
        return responseError(502, e);
    }
}


exports.logout = async (user_id) => {
    try {
         await AccountInfo.findOneAndUpdate({
            "user_id": user_id
        },{"online":false}).exec();

        return responseSuccess("Logout Success", {
            "user_id": user_id,
            "updated_time": moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        });
    } catch (e) {
        return responseError(502, e);
    }
}

const findOnePassword = async (username) => {
    try {
        let result = await AccountInfo.findOne({
            "username": username
        }, {
            "_id": 0,
            "__v": 0
        }).lean().exec();
        return result.password;
    } catch (e) {
        return null;
    }
}