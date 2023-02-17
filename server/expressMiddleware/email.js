const nodemailer = require('nodemailer');
const emailConfig = require('../config/smtp');
const configKey = require('../config/keys');
//https://stackoverflow.com/questions/39092822/how-to-do-confirm-email-address-with-express-node
/*
const smtpConfig = {
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 465,
    secure: true,
    auth:{
        user: 'AKIAJEO4GD5SUP433IGQ',
        pass: 'AjCCs8DdpiPuMEd0pYAsViYSLTtHR6zfP/EUjJBLS6DX'
    }
};

*/

const smtpConfig = {
    host: emailConfig.smtp.host,
    port: emailConfig.smtp.port,
    secure: true,
    auth:{
        user: emailConfig.smtp.username,
        pass: emailConfig.smtp.password
    }
};

const smtpTransporter = nodemailer.createTransport(smtpConfig);
module.exports = {
  sendVerifyEmail: function(req, res) {
      const name = req.user.local.name;
      const email = req.user.local.email;
      const rand = req.user.rand;
      const baseUrl = configKey.baseUrl;
      const url = `${baseUrl}/auth/verify?email=${email}&rand=${rand}`;
      const renderedHTML = generateActivatedContent(name, url, email);
      const mailOptions = {
          from: emailConfig.smtp.fromAddress,
          to: email,
          subject: " Please confirm your email account",
          html: renderedHTML
      };

      smtpTransporter.sendMail(
      mailOptions, function (err, result) {
          if(err) {
              console.log(err);
          }
          console.log(result);
      })
  }
};
function generateActivatedContent(username, url, email) {
  return `<p> Welcome ${username},
    <br><br> Thank you for registering with us. Verify that you own <a href="${url}"> ${email} </a>
    <br><br>Regards
    <br>FPT smart targeting</p>`;
}




