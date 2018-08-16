const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/myDatabase', { useNewUrlParser: true });

const Schema = mongoose.Schema;

const accountInfoSchema = new Schema({
    "user_id": { type: String, index: { unique: true, dropDups: true } },
    "username": { type: String, required: true, unique: true},
    "first_name": { type: String, default:null },
    "display_name": { type: String },
    "description": { type: String, default:null},
    "password": { type: String, required: true},            
    "email": { type: String, required: true },   
    "phone": { type: String, required: true },              
    "role_id": { type: String, required: true },
    "role_name": { type: String, required: true },
    "photo_filename": { type: String, default:null },
    "photo_url": { type: String, default:null },
    "photo_preview_url": { type: String, default:null },
    "online": { type: Boolean, default: 0 },
    "last_login": { type: Date, default:null},  
    "active_status": { type: Number, default: 0 },
    "retry_for_login": { type: Number, default: 0 },
    "email4cc":{ type: String, default: null } ,
    "root":{ type: Number, default: 0 },
    "created_time": { type: Date, default: Date.now },
    "updated_time": { type: Date, default: Date.now }
}, { minimize: false });

accountInfoSchema.pre('save', function (next) {
    this.updated_time = Date.now();
    this.display_name = this.get('display_name') || this.get('username');
    next();
});

//create model
const accountInfo = mongoose.model('account', accountInfoSchema);

module.exports = accountInfo;