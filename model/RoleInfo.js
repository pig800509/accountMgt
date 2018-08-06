const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myDatabase', { useNewUrlParser: true });

const Schema = mongoose.Schema;

const roleInfoSchema = new Schema({
    "role_id": { type: String, index: { unique: true, dropDups: true } },
    "role_name": { type: String, required: true, unique: true},
    "display_name": { type: String, default:null },
    "description": { type: String, default:null},
    "active_status": { type: Boolean, default: 0 },
    "used": { type: Boolean, default: 0 },
    "num_of_users": { type: Number, default:0},  
    "permission_settings": { type: Schema.Types.Mixed, required: true},
    "created_time": { type: Date, default: Date.now },
    "updated_time": { type: Date, default: Date.now }
}, { minimize: false });

roleInfoSchema.pre('save', function (next) {
    this.updated_time = Date.now();
    this.display_name = this.get('role_name');
    next();
});

//create model
const roleInfo = mongoose.model('role', roleInfoSchema);

module.exports = roleInfo;