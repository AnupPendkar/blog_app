import nodemailer from 'nodemailer';

export default async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.HOST,
      port: 465,
      secure: true,
      logger: true,
      debug: true,
      secureConnection: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnAuthorized: true,
      },
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: 'https://storyhavenblog.onrender.com - Anup Pendkar',
      to: email,
      subject: title,
      html: body,
    });
    return info;
  } catch (error) {
    console.log(error.message);
  }
};
