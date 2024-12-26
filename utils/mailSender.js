const nodemailer = require('nodemailer');

const mailSender = async (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,  
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: subject,
    html: message,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = mailSender;
