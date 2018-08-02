/**
 * Created by Jerry 20180409
 */

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myDatabase');

const Schema = mongoose.Schema;

//create schema
//type:String,Number,Date,Buffer,Boolean,Mixed,ObjectId,Array
//index:是否設為索引
//default:預設值
const deviceSecuritySchema = new Schema({
    "device_id": { type: String, index:  {unique: true, dropDups: true } },
    "security_key": { type: String, required: true },
    "enable": { type: String, default: 'enabled' },  /* enabled, disabled */
    "expiration": { type: Date },
    "created_time": { type: Date, default: Date.now },
    "updated_time": { type: Date, default: Date.now }
 });

//create model
const deviceSecurity = mongoose.model('deviceSecurity', deviceSecuritySchema);

module.exports = deviceSecurity;
