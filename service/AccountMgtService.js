'use strict';

const moment = require('moment');
const fileSystem = require('file-system');
const path = require('path');
//const uuid = require('uuid');
const AccountInfo = require('../model/AccountInfo');
//const RoleInfo = require('../model/RoleInfo');
//const responseError = require('./ResponseError');
const IDGen = require('../utils/IDGenerator');
const checkbody = require('../utils/CheckBody');
const { responseError } = require('../utils/Response');

exports.listAccount = async () => {
    try {
        return await AccountInfo.find({}, {
            "_id": 0,
            "__v": 0
        }).lean().exec();
    } catch (e) {
        return responseError(502, e);
    }
}

exports.findAccountByRole = async (role_id) => {
    try {
        return await AccountInfo.find({
            "role_id": role_id
        }).lean().exec();
    } catch (e) {
        return responseError(502, e);
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
        return responseError(502, e);
    }
}

exports.createAccount = async (ctx) => {
    const body = ctx.request.body.fields;
    const require_params = ["username", "password", "email", "phone", "role_id"];
    
    const checkrequest = checkbody(require_params, body);
    if (!checkrequest.status)
        return responseError(502, checkrequest.status_msg);
    
    var newitem = {
        "user_id": IDGen.genIdInUUIDForm(),
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
        //let filename = IDGen.genIdInDatetimeForm();
        let body = ctx.request.body;
        let dirPath = path.join(__dirname, '../public/thumbnail');
        let fullfilename = body.fields.photo_filename + '.' + body.files.photo.name.split('.').pop();
        fileSystem.mkdirSync(dirPath);
        let file = body.files.photo;
        if(file){
            let reader = fileSystem.createReadStream(file.path);
            let stream = fileSystem.createWriteStream(path.join(dirPath, fullfilename));
            reader.pipe(stream);
            console.log("photo uploading...");
            let photo_url = `/public/thumbnail/${fullfilename}`;
            newitem.photo_filename= body.fields.photo_filename;
            newitem.photo_url= photo_url;
            newitem.photo_preview_url=ctx.host + photo_url;
        }
        return await AccountInfo.create(newitem);
    } catch (e) {
        return responseError(502, e);
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
        return responseError(502, e);
    }
}

exports.removeOneAccount = async (user_id) => {
    try {
        await AccountInfo.deleteOne({
            "user_id": user_id
        }).exec();
    } catch (e) {
        return responseError(502, e);
    }
}
