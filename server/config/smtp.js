'use strict';
const SMTP_HOST = "email-smtp.us-east-1.amazonaws.com";
const SMTP_PORT = 465;
const SMTP_USERNAME = "AKIAJEO4GD5SUP433IGQ";
const SMTP_PASSWORD = "AjCCs8DdpiPuMEd0pYAsViYSLTtHR6zfP/EUjJBLS6DX";
const SMTP_FROM = "FPT <no.reply@vio.edu.vn>";

module.exports = {
    smtp: {
        host: SMTP_HOST,
        port: SMTP_PORT,
        username: SMTP_USERNAME,
        password: SMTP_PASSWORD,
        fromAddress: SMTP_FROM,
    },
};