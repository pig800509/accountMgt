exports.checkbody = function (require, body) {
    let fail = {
        "status": false
    };
    let success = {
        "status": true
    };
    for (var i = 0; i < require.length; i++) {
        if (!body[require[i]])
            return Object.assign(fail, {
                "status_msg": require[i] + " is reqired."
            });
    }
    return success;
}