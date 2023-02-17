const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const isEmpty = require('../validation/is-empty');

const RoleSchema = new Schema({
    role_id:{ type: String, required: [true," cannot be empty"], unique: true, index:true},
    role_name:{ type: String, required: [true," cannot be empty"], unique: true, index:true},
    permissions: {type:String, required: [true, "cannot be empty"]}
});

RoleSchema.statics.getPermissions = function(id) {
    return new Promise((resolve, reject) => {
        this.findOne({role_id:id}, (err, role) =>{
            if (err) {
                return reject(err);
            }
            if (isEmpty(role) || isEmpty(role.permissions)) return resolve("");
            return resolve(role.permissions);
        });
    });
};


RoleSchema.statics.generateTestData = function(id) {
    const query = {'role_id': id};
    const update = {
        $set: {
            'role_id ': id,
            'role_name': 'Admin_test',
            'permissions':'view:users;delete:users'
        }
    };
    const options = {new: true, upsert: true};
    Role.findOneAndUpdate(query, update, options, (err, role) => {
        if (err) throw err;
        return role;
    });
};
Role = mongoose.model('roles', RoleSchema);
module.exports = Role;














