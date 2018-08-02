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
const deviceProfileSchema = new Schema({
    "device_id": { type: String, index:  {unique: true, dropDups: true } },
    "heartbeat": { type: Number, required: true, default: 5 },  /* Unit: second. Exception: for no_agent model type, it can be 0 */
    "log_level": { type: String, required: true, default: 'info' },  /* error, info, debug. Exception: for no_agent model type, it can be 'n/a' */
    "time_sync_settings": { type: Schema.Types.Mixed, default: {} },
    "created_time": { type: Date, default: Date.now },
    "updated_time": { type: Date, default: Date.now },
}, { minimize: false });

//use middleware, update time to updateTime field
//ref http://mongoosejs.com/docs/2.7.x/docs/middleware.html 
deviceProfileSchema.pre('save', function(next){
    this.created_time = Date.now();
    next();
});

//create model
const deviceProfile = mongoose.model('deviceProfile', deviceProfileSchema);

module.exports = deviceProfile;