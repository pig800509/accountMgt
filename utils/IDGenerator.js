const moment = require('moment');
const uuidv1 = require('uuid/v1');

module.exports = {
    genIdInDatetimeForm() {
        return moment().format('YYYYMMDDHHmmss');
    },
    genIdInUUIDForm() {
        return uuidv1();
    }
}