'use strict';
const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID ||"204965109970298";
const FACEBOOK_CLIENT_SECRETKEY = process.env.FB_SECRET || "7bb9f89c6fbf21c447ef05735570d095";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "406922588395-4o02megfb5rn44rncrnlki5soablqk8i.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRETKEY= process.env.GOOGLE_CLIENT_SECRETKEY ||"I7Vkm5pP3HDigt_AHaRxVgwR";

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
    jwtTokenSecret:'your secret key'
};


