const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');  //https://www.npmjs.com/package/bcryptjs
const Schema = mongoose.Schema;

const UserSmartDoorSchema = new Schema({
    id: {type: String},
    name: {type: String},
    department: {type: String},
    is_deleted: {type: Boolean},
    image_link: {type: String},
    created_time: {type: Date},
    updated_time: {type: Date},

});

UserSmartDoorManagement = mongoose.model('user_smart_doors', UserSmartDoorSchema);
module.exports = UserSmartDoorManagement;

