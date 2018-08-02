/**
 * Created by Jaime 20180409
 */

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myDatabase');

const Schema = mongoose.Schema;

//create schema
//type:String,Number,Date,Buffer,Boolean,Mixed,ObjectId,Array
//index:是否設為索引
//default:預設值
const devicePeripheralSchema = new Schema({
    "device_id": { type: String, required: true },
    "peripheral_id": { type: String, required: true },  /* ex: 0x2a02 */
    "peripheral_name": { type: String, required: true },  /* ex: WebCam C920 */
    "type": { type: String, required: true },     /* ex: WebCam */
    "description": { type: String }, /* ex: WebCam C920x HD */
    "vendor": { type: String },      /* ex: Logitech */
    "subtype": { type: String },     /* ex: 0x00 */
    "product": { type: String },     /* ex: C920x */
    "category": { type: Number },    /* 0: n/a, 1: web cam */
    "created_time": { type: Date, default: Date.now },
    "updated_time": { type: Date, default: Date.now },
});

//use middleware, update time to updateTime field
//ref http://mongoosejs.com/docs/2.7.x/docs/middleware.html 
devicePeripheralSchema.pre('save', function(next){
    this.updated_time = Date.now();
    next();
});

//create model
const devicePeripheralModel = mongoose.model('devicePeripheral', devicePeripheralSchema);

module.exports = devicePeripheralModel;