'use strict';


/**
 * An API for device to update heartbeat
 * This API can update device's online status
 *
 * authentication String security key used for authentication
 * body Body_7 body arguments
 * returns 200Response
 **/
exports.heartbeat = function(authentication,body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "result" : {
    "status" : "OK",
    "status_code" : 200,
    "status_msg" : "Success"
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
 * Initialize device agent
 * This is the API for device agent to get initialization tasks from server
 *
 * authentication String security key used for authentication
 * body Body_5 body arguments
 * returns 200Response
 **/
exports.initDevice = function(authentication,body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "result" : {
    "status" : "OK",
    "status_code" : 200,
    "status_msg" : "Success"
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
 * Register device agent to server
 * This is the first API for device agent to access server
 *
 * authentication String security key used for authentication
 * returns 200Response
 **/
exports.registerDevice = function(authentication) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "result" : {
    "status" : "OK",
    "status_code" : 200,
    "status_msg" : "Success"
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
 * Update task status
 * This is the API to update task status
 *
 * authentication String security key used for authentication
 * body Body_6 body arguments
 * returns 200Response
 **/
exports.updateTaskStatus = function(authentication,body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "result" : {
    "status" : "OK",
    "status_code" : 200,
    "status_msg" : "Success"
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

