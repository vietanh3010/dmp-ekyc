const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  //https://www.npmjs.com/package/bcryptjs
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    id: {type: String},
    account: {type: String},
    name: {type: String},
    cttv: {type: Number},
    unit: {type: String},
    department: {type: String},
    author: {type: String},
    author_name: {type: String},
    author_phone: {type: String},
    author_email: {type: String},
    apply_date: {type: Date},
    status_before: {type: String},
    aim: {type: String},
    content: {type: String},
    effective: {type: String},
    new: {type: String},
    creative: {type: String},
    next_step: {type: String},
    security_info: {type: String},
    conditions: {type: String},
    file: {type: Array},
    additionalData: {type: String},
    examiner: {type: String},
    status: {type: Number},
    economy_effective: {type: Number},
    effective_guess: {type: String},
    bonus_type: {type: String},
    bonus_value: {type: String},
    is_ikhien: {type: Boolean},
    created_date: {type: Date},
    updated_date: {type: Date},
    upn: {type: String},
    status_name: {type: String},
    cttv_name: {type: String},
});

ProjectManagement = mongoose.model('projects', ProjectSchema);
module.exports = ProjectManagement;

