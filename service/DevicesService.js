'use strict';

const moment = require('moment');
const _ = require('lodash');
const randomString = require('randomstring');

const Device = require('../model/Device');
const DeviceProfile = require ('../model/DeviceProfile');
const DeviceSecurity = require ('../model/DeviceSecurity');
const DevicePeripheral = require ('../model/DevicePeripheral');

/* Error message packager */
/**
 * @param {Number} errCode The HTTP status code
 * @param {String} errString The error message
 */
const responseErrMsg = (errCode, errString) => {
    /* Error message template */
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

/**
 * Create a new Device
 * Three arguments to be provided in this interface mac_addr is optional, and should be unique in database 
 *
 * body Body Arguments to create a new device
 * returns 200Response
 **/
exports.createDevice = async (body) => {
    console.log('create device');

    let reqBody;
    if ( typeof body === 'object' )
        reqBody = body;
    else if ( typeof body === 'string' )
        reqBody = JSON.parse(body);
    else
        return responseErrMsg(400, "unkown type of body");

    // check req.device_name
    if ( !reqBody.device_name )
        return responseErrMsg(400, "device name not defined");
    else {
        let deviceResult = await Device.findOne({device_name: reqBody.device_name}).exec();
        let deviceDescription = (reqBody.description)?reqBody.description : "";
        let devID = moment().format('YYYYMMDDHHmmss');
        let securityKey = randomString.generate(8);
        let newDeviceData = {
            device_id: devID,
            device_name: reqBody.device_name,
            mac_addr: reqBody.mac_addr.toLowerCase(),
            description: deviceDescription,
            serviceconnect_settings: {},
            created_time: Date.now(),
            updated_time: Date.now()
        };
        let newDevicePrfile = {
            device_id: devID,
            time_sync_settings: {},
            created_time: Date.now(),
            updated_time: Date.now()
        };
        let newDeviceSecurity = {
            device_id: devID,
            security_key: securityKey,
            expiration: moment().add(1, 'month'),
            created_time: Date.now(),
            updated_time: Date.now()
        }

        newDevicePrfile.heartbeat = 5,
        newDevicePrfile.log_level = 'info',
        newDevicePrfile.time_sync_settings = {
            sync_mode: 'ntp',
            sync_interval: 720,
            ntp_server: 'time.stdtime.gov.tw',
            ntp_port: 123,
            timezone: 'UTC+08:00'
        }

        // default service connection settings
        newDeviceData.serviceconnect_settings = {
            broker: 'iotdev.wiccs.net',
            port: 8883,
            username: 'mqtt',
            passwd: 'mqtt'
        }

        // console.log(newDevicePrfile);

        // insert DeviceInfo
        deviceResult = await Device.create(newDeviceData);
        // console.log('device result: ', deviceResult);
        // insert DeviceProfile
        let deviceProfileResult = await DeviceProfile.create(newDevicePrfile);
        // console.log('device profile reult: ', deviceProfileResult);
        // insert DeviceSecurity
        let deviceSecurityResult = await DeviceSecurity.create(newDeviceSecurity);
        // console.log('device security reult: ', deviceSecurityResult);

        let response = {
            results: {
                status: 'OK',
                status_code: '200',
                status_msg: 'Create success',
                device_id: devID,
                security_key: securityKey,
                time_sync_settings: deviceProfileResult.time_sync_settings,
                created_time: moment(deviceResult.create_time).format('YYYY-MM-DD HH:mm:ss')
            }
        };

        return  response;
    }
}
// exports.createDevice = function (body) {
//     return new Promise(function (resolve, reject) {
//         var examples = {};
//         examples['application/json'] = {
//             "result": {
//                 "status": "OK",
//                 "status_code": 200,
//                 "status_msg": "Success"
//             }
//         };
//         if (Object.keys(examples).length > 0) {
//             resolve(examples[Object.keys(examples)[0]]);
//         } else {
//             resolve();
//         }
//     });
// }


/**
 * Get a list of all Devices
 * Get all results from database 
 *
 * returns 200Response
 **/
exports.findDevices = async () => {
    console.log ('find');

    let selectedFields = {
        device_id: 1,
        device_name: 1,
        model_id: 1,
        model_name: 1,
        description: 1,
        mac_addr: 1,
        ip_addr: 1,
        active_status: 1,
        register_status: 1,
        online: 1,
        os_type: 1,
        os_version: 1,
        cpu_type: 1,
        mem_size: 1,
        disk_size: 1,
        heartbeat_time: 1,
        register_time: 1
    };

    let deviceRequest =  await Device.find({}, selectedFields).lean().exec();
    let deviceProfileResult = await DeviceProfile.find().exec();

    if ( !deviceRequest )
        return { device_list: [] };
    else {
        _.forEach(deviceRequest, (obj) => {
            // check online status
            // bad method, find whether there will be a better one
            let profile = _.find(deviceProfileResult, {'device_id': obj.device_id});
            if ( profile.heartbeat && obj.heartbeat_time )
                obj.online = (Math.abs(moment().diff(obj.heartbeat_time, 's')) <= (profile.heartbeat * 1 + 3))? 'online' : 'offline';
            else
                obj.online = 'offline';

            obj.register_time = moment(obj.register_time).format('YYYY-MM-DD HH:mm:ss');
        });

        return { device_list: deviceRequest };
    }
}
// exports.findDevices = function () {
//     return new Promise(function (resolve, reject) {
//         var examples = {};
//         examples['application/json'] = {
//             "result": {
//                 "status": "OK",
//                 "status_code": 200,
//                 "status_msg": "Success"
//             }
//         };
//         if (Object.keys(examples).length > 0) {
//             resolve(examples[Object.keys(examples)[0]]);
//         } else {
//             resolve();
//         }
//     });
// }


/**
 * Get a specific device profile
 * Device id should exist in database
 *
 * device_id String device id
 * returns 200Response
 **/
exports.findOneDevProfile = function (device_id) {
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


/**
 * Get a specific device security
 * Device id should exist in database
 *
 * device_id String device id
 * returns 200Response
 **/
exports.findOneDevSecurity = function (device_id) {
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


/**
 * Get a list of all Devices
 * Get all results from database
 *
 * device_id String device id
 * returns 200Response
 **/
exports.findOneDevice = async (device_id) => {
    console.log ('find one');

    let selectedFields = {
        device_id: 1,
        device_name: 1,
        model_id: 1,
        model_name: 1,
        description: 1,
        mac_addr: 1,
        ip_addr: 1,
        active_status: 1,
        register_status: 1,
        online: 1,
        os_type: 1,
        os_version: 1,
        cpu_type: 1,
        mem_size: 1,
        disk_size: 1,
        grouped: 1,
        heartbeat_time: 1,
        register_time: 1
    };

    let deviceResult =  await Device.findOne({device_id: device_id}, selectedFields).lean().exec();

    if ( !deviceResult )
        return {};
    else {
        let deviceProfileResult = await DeviceProfile.findOne({device_id: deviceResult.device_id}).exec();
        if ( deviceProfileResult.heartbeat )
            deviceResult.online = (Math.abs(moment().diff(deviceResult.heartbeat_time, 's')) <= (deviceProfileResult.heartbeat * 1 + 3))? 'online' : 'offline';
        else
            deviceResult.online = 'offline';
        deviceResult.register_time = moment(deviceResult.register_time).format('YYYY-MM-DD HH:mm:ss');
        return deviceResult;
    }
}
// exports.findOneDevice = function (device_id) {
//     return new Promise(function (resolve, reject) {
//         var examples = {};
//         examples['application/json'] = {
//             "result": {
//                 "status": "OK",
//                 "status_code": 200,
//                 "status_msg": "Success"
//             }
//         };
//         if (Object.keys(examples).length > 0) {
//             resolve(examples[Object.keys(examples)[0]]);
//         } else {
//             resolve();
//         }
//     });
// }


/**
 * Get the peripheral list for a specific device
 * Device id should exist in database
 *
 * device_id String device id
 * returns 200Response
 **/
exports.findPeripheralsOfDev = function (device_id) {
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


/**
 * Delete a specific device
 * Device id should exist in database
 *
 * device_id String device id
 * returns 200Response
 **/
exports.removeOneDevice = async (device_id) => {
    console.log ('destroy');

    let deviceResult = await Device.findOne({device_id: device_id}).exec();

    // check whether device exist in db
    if ( !deviceResult )
        return responseErrMsg(400, 'Device not exist');
    // check active_status
    else if ( deviceResult.active_status == "active" )
        return responseErrMsg(400, "Cannot delete device with active status");
    else {
        let filterParam = {
            device_id: device_id
        };
        deviceResult =  await Device.deleteOne(filterParam).exec();

        if ( !deviceResult.ok )
            return responseErrMsg(500, 'Delete Fail');
        else if ( deviceResult.ok && !deviceResult.n )
            return responseErrMsg(400, 'Nothing deleted');
        else if ( deviceResult.ok && deviceResult.n ) {
            // delete data in devicesecurity, deviceprofile, deviceperipheral, devicemetadata, and tasks
            let deviceSecurityResult = await DeviceSecurity.deleteMany({device_id: device_id}).exec();
            let deviceProfileResult = await DeviceProfile.deleteMany({device_id: device_id}).exec();
            let devicePeripheralResult = await DevicePeripheral.deleteMany({device_id: device_id}).exec();

            return {
                results: {
                    status: 'OK',
                    status_code: '200',
                    status_msg: 'Delete Success',
                    device_id: device_id,
                    updated_time: moment().format('YYYY-MM-DD HH:mm:ss')
                }
            };
        }
    }
}
// exports.removeOneDevice = function (device_id) {
//     return new Promise(function (resolve, reject) {
//         var examples = {};
//         examples['application/json'] = {
//             "result": {
//                 "status": "OK",
//                 "status_code": 200,
//                 "status_msg": "Success"
//             }
//         };
//         if (Object.keys(examples).length > 0) {
//             resolve(examples[Object.keys(examples)[0]]);
//         } else {
//             resolve();
//         }
//     });
// }


/**
 * Renew a new device security key
 * Device id should exist in database
 *
 * device_id String device id
 * body Body_4 body arguments
 * returns 200Response
 **/
exports.renewDevSecurity = function (device_id, body) {
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


/**
 * Unregister a specific device (unregister)
 * Device id should exist in database
 *
 * device_id String device id
 * returns 200Response
 **/
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


/**
 * Update a specific device profile
 * Should provide at least one element in body
 *
 * device_id String device id
 * body Body_2 body arguments
 * returns 200Response
 **/
exports.updateDevProfile = function (device_id, body) {
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


/**
 * Update a specific device security
 * Should provide at least one element in body
 *
 * device_id String device id
 * body Body_3 body arguments
 * returns 200Response
 **/
exports.updateDevSecurity = function (device_id, body) {
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


/**
 * Update a specific device (info)
 * Should provide at least one element in body
 *
 * device_id String device id
 * body Body_1 body arguments
 * returns 200Response
 **/
exports.updateDevice = async (device_id, body) => {
    console.log ('update');

    let reqBody;
    if ( typeof body === 'object' )
        reqBody = body;
    else if ( typeof body === 'string' )
        reqBody = JSON.parse(body);
    else
        return responseErrMsg(400, "unkown type of body");

    // check whether device exist in db
    let deviceResult = await Device.findOne({device_id: device_id}).exec();
    // console.log( 'device result: ', deviceResult );
    if ( !deviceResult )
        return responseErrMsg(400, "device not exist");
    else {
        let filterParam = {
            device_id: device_id
        };

        let setData = {};
        if ( reqBody.device_name ) {
            console.log ('to be updated device_name: ', reqBody.device_name);

            // check whether the same device_name in db
            deviceResult = await Device.findOne({device_name: reqBody.device_name}).exec();
            if ( deviceResult )
                return responseErrMsg(400, "Duplicate device_name, please pick up another one");
            else
                setData.device_name = reqBody.device_name;
        }
        if ( reqBody.description )
            setData.description = reqBody.description;

        // prevent insert empty object
        if ( Object.keys(setData).length == 0 )
            return responseErrMsg(400, 'empty arguments, nothing to be modified');
        else {
            let deviceResult =  await Device.updateOne(filterParam, {$set: setData}).exec();
            
            // console.log ('device result: ', deviceResult);

            if ( deviceResult.ok == 1 && deviceResult.nModified == 1 ) {
                deviceResult = await Device.findOne({device_id: device_id}, {}).exec();
                return {
                    results: {
                        status: 'OK',
                        status: '200',
                        status_msg: 'Update Success',
                        device_id: device_id,
                        device_name: deviceResult.device_name,
                        description: deviceResult.description,
                        active_status: deviceResult.active_status,
                        updated_time: moment(deviceResult.updated_time).format('YYYY-MM-DD HH:mm:ss')
                    }
                }
            }
            else {
                return responseErrMsg(500, 'Update Fail');
            }
        }
    }
}
// exports.updateDevice = function (device_id, body) {
//     return new Promise(function (resolve, reject) {
//         var examples = {};
//         examples['application/json'] = {
//             "result": {
//                 "status": "OK",
//                 "status_code": 200,
//                 "status_msg": "Success"
//             }
//         };
//         if (Object.keys(examples).length > 0) {
//             resolve(examples[Object.keys(examples)[0]]);
//         } else {
//             resolve();
//         }
//     });
// }

