exports.response = async (ctx, resData) => {
    if (resData.results && resData.results.status_code && resData.results.status_code > 200) {
        if (ctx.response.status === 'number')
            ctx.response.status = resData.results.status_code;
        else
            ctx.response.status = parseInt(resData.results.status_code);
        ctx.response.body = resData;
    } else
        ctx.body = resData;
};

exports.responseError = function (errCode, errString) {
    /* Error message template */
    var errMsg = {
        results: {
            status: 'Fail',
            status_code: 400,
            status_msg: ''
        }
    };

    errMsg.results.status_msg = errString;
    errMsg.results.status_code = errCode;

    return errMsg;
}

exports.responseSuccess = function (successString, body) {
    /* Error message template */
    var suMsg = {
        results: {
            status: 'OK',
            status_code: 200,
            status_msg: ''
        }
    };

    suMsg.results.status_msg = successString;
    Object.assign(suMsg.results, body);
    return suMsg;
}