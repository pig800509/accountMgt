const jwt = require('jsonwebtoken');
const util = require('util');
const verify = util.promisify(jwt.verify);

const TokenHandler = {
    sign: (payload, certString) => {
        if (typeof payload === 'object') {
            let token = jwt.sign(payload, certString, {
                expiresIn: 60 * 60
            });

            return {
                token: token
            };
        } else {
            return {
                error: 'payload should be in json format'
            }
        }
    },
    verify: async (token, certString) => {
        try {
            let decoded = await verify(token, certString);
            return {
                result: decoded
            };
        } catch (error) {
            if (error.name === 'TokenExpiredError')
                return {
                    error: 'Token expired'
                };
            else
                return {
                    error: 'Invalid token'
                };
        }
    }
};

module.exports = TokenHandler;