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
    
    try {
        const password = await findOnePassword(body.username);
        if( password === body.password){
            return 
        }
        
        const auth = await AccountInfo.findOne({
            "username": body.username
        });
        
    } catch (e) {
        return responseError(502, e);
    }
}


exports.logout = async (user_id) => {
    
    try {
        const auth = await AccountInfo.findOne({
            "username": body.username
        });
        
            
    } catch (e) {
        return responseError(502, e);
    }
}

const findOnePassword = async (username) => {
    //console.log('Verify user');
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