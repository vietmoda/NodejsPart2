import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
dotenv.config()

export const sendEmailService = async (email) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://gmail.com>
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"send api email"', // sender address
          to: email, // list of receivers
          subject: "Hello subject", // tiêu đề email
          text: "Hello world text", // plain text body
          html: "<b>Hello world html</b>", // nội dung
        });
        return info
}
