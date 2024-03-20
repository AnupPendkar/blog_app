import nodemailer from 'nodemailer';

console.log(process.env.MAIL_USER, process.env.MAIL_PASS);
export default async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: 'www.StoryHaven.me - Anup Pendkar',
      to: email,
      subject: title,
      html: body,
    });
    console.log('Email info: ', info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};
