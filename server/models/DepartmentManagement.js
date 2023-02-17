const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeparmentSchema = new Schema({
    name: {type: String},
    desc: {type: String},
    updated_time: {type: String}
});

DepartmentManagement = mongoose.model('departments', DeparmentSchema);
module.exports = DepartmentManagement;

