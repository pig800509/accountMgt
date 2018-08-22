'use strict';
const moment = require('moment');
const AccountInfo = require('../model/AccountInfo');
const { findOneByUsername } = require('./AccountMgtService');
const checkbody = require('../utils/CheckBody');
const TokenHandler = require('../utils/TokenHandler');
const {
    responseSuccess,
    responseError
} = require('../utils/Response');

const secret = require('../config/default').tokenCert;
const io = require('../sockio');

exports.login = async (request) => {
    const body = request.fields || JSON.parse(request);
    console.log(body);
    const require_params = ["username", "password"];
    const checkrequest = checkbody(require_params, body);
    if (!checkrequest.status)
        return responseError(401, checkrequest.status_msg);
    try {
        const userInfo = await findOneByUsername(body.username);
        const password = userInfo.password;
        if (password === body.password && userInfo.active_status == 1) {
            //const token = TokenHandler.verify();
            const result = await AccountInfo.findOneAndUpdate({
                "username": body.username
            }, {
                "online": 1
            }, {
                new: true,
                fields: {
                    "_id": 0,
                    "__v": 0,
                    "password": 0
                }
            });
            //user id, username, role_name, role_id
            let userToken = {
                "user_id": result.user_id,
                "username": result.username,
                "role_id": result.role_id,
                "role_name": result.role_name
            };
            const jwt = TokenHandler.sign(userToken, secret);
            io.emitMsg("account/"+result.user_id,{"topic":"onlineStatus", "data":{"online":1}});
            return responseSuccess("Login Success", {
                "user_id": result.user_id,
                "username": body.username,
                "token": jwt.token,
                "updated_time": moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            });
        }
        else {
            let retry_login = userInfo.retry_for_login;
            retry_login ++;
            if (retry_login < 4) {
                await AccountInfo.findOneAndUpdate({
                    "username": body.username
                }, {
                    "retry_for_login": retry_login
                });
                return responseError(401, "Wrong username or password.");
            } else {
                await AccountInfo.findOneAndUpdate({
                    "username": body.username
                }, {
                    "active_status":3
                });
                return responseError(401, "This account has been locked. Please contact IT.");
            }
        }

    } catch (e) {
        return responseError(400, "Wrong username or password.");
    }
}


exports.logout = async (user_id) => {
    try {
        await AccountInfo.findOneAndUpdate({
            "user_id": user_id
        }, {
            "online": 0
        }).exec();
        io.emitMsg("account/"+user_id,{"topic":"onlineStatus", "data":{"online":0}});
        return responseSuccess("Logout Success", {
            "user_id": user_id,
            "updated_time": moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        });
    } catch (e) {
        return responseError(502, e);
    }
}
