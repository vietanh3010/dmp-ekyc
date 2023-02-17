const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const isEmpty = require('../validation/is-empty');
const DEFAULT_USER_LEVEL = "normal";
const UserSchema = new Schema({
    local: {
        unit_name: String,
        username: String,
        email: String,
        password: String,
        phone: String

    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    roles: {type: String, default: "100"},  // Set default user = normal user = 100, superuser = 10, admin = 1
    class: {type: String},
    email_activated: {type: Boolean, default: true},
    rand: {type: String},
    created: {type: Date, default: Date.now}, //automatically generated timestamp when a new user account is created
    updated: {type: Date},
    updated_by: {type: String},
    created_by: {type: String},
    first_login: {type: Boolean, default: true}, //MFA
    is_active: {type: Boolean, default: true}, //activate or inactivated user by superuser
    is_admin_activated: {type: Boolean, default: true}, // use this field for case activate/deactivate superusers and its users by admin.
    is_deleted: {type: Boolean, default: false},
    api_key: {type: String}
});

UserSchema.statics.getRoles = function (_id) {
    return new Promise((resolve, reject) => {
        this.findById(_id, (err, user) => {
            if (err) return reject(err);
            if (isEmpty(user) || isEmpty(user.roles)) return resolve("");
            return resolve(user.roles);
        })
    });
};
User = mongoose.model('users', UserSchema);
module.exports = User;
