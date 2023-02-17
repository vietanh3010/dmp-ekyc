const bcrypt = require('bcryptjs');
const SEED_LENGTH = 8;

module.exports ={
    //auto-gen salt and hash;
    generateHash: function(plaintext_password) {
        return new Promise((resolve, reject ) => {
            bcrypt.hash(plaintext_password, SEED_LENGTH, (err, hash)=>{
                if (err) return reject(err);
                if (hash) return resolve(hash);
            });
        });

    }
};

// Don't know what happen when wrap bcrypt compare in promise in case can't compare it nevers end