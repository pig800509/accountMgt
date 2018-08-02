/**
 * Created by Justy 20180327
 */

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myDatabase');

const Schema = mongoose.Schema;

//create schema
//type:String,Number,Date,Buffer,Boolean,Mixed,ObjectId,Array
//index:是否設為索引
//default:預設值
const deviceSchema = new Schema({
    "device_id": { type: String, index:  {unique: true, dropDups: true } },
    "device_name": { type: String, required: true },
    "description": { type: String },
    "ip_addr": { type: String },
    "mac_addr": { type: String },
    "active_status": { type: String, default: 'init' },            /* 0: init, 1: active, 2: inactive, 4: deleted */
    "register_status": { type: String, default: 'unregister' },    /* 0: unregister, 1: registered, 2: register_failed */
    "online": { type: String, default: 'offline' },                /* 0: offline, 1: online */
    "os_type": { type: String },
    "os_version": { type: String },
    "cpu_type": { type: String },
    "mem_size": { type: String },
    "disk_size": { type: String },
    "serviceconnect_settings": { type: Schema.Types.Mixed, default: {} },  /* IoT Cloud Service Connection Settings */
    "register_time": { type: Date, default: Date.now },
    "heartbeat_time": { type: Date, default: Date.now },
    "created_time": { type: Date, default: Date.now },
    "updated_time": { type: Date, default: Date.now },
}, { minimize: false });

//use middleware, update time to updateTime field
//ref http://mongoosejs.com/docs/2.7.x/docs/middleware.html 
deviceSchema.pre('save', function(next){
    this.updated_time = Date.now();
    next();
});

//create model
const device = mongoose.model('device', deviceSchema);

module.exports = device;