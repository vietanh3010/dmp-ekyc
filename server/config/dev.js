'use strict';

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID || "204965109970298";
const FACEBOOK_CLIENT_SECRETKEY = process.env.FB_SECRET || "7bb9f89c6fbf21c447ef05735570d095";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "435976263559711";
const GOOGLE_CLIENT_SECRETKEY = process.env.GOOGLE_CLIENT_SECRETKEY || "abc7d2421d59707a91c5858c058db48d";

module.exports = {
    facebook: {
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRETKEY,
        callbackURL: "/auth/facebook/callback"
    },
    google: {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRETKEY,
        callbackURL: "/auth/google/callback"
    },

    mongoURI: process.env.SL_MONGO_URL || 'mongodb://localhost:27017/smart_door?authSource=admin',
    logFilePath: ".\\logs\\log.log",
    logLevel: "debug",
    baseUrl: process.env.SL_BASE_URL || "http://localhost:5000",
    environment: process.env.NODE_ENV || "development",
    fsAddURI: process.env.FACE_SEARCH_ADD_URL || 'https://api.fpt.ai/dmp/facesearch/v2/add',
    fsCreateURI: process.env.FACE_SEARCH_CREATE_URL || 'https://api.fpt.ai/dmp/facesearch/v2/create',
    fsDeleteURI: process.env.FACE_SEARCH_DELETE_URL || 'https://api.fpt.ai/dmp/facesearch/v2/delete',
    fsApi_key: "DMP@2019"
    // fsAddURI: 'mongodb://localhost:27017/smart_door?authSource=admin',
};







