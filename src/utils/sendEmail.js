import transporter from "../config/nodemailer.js";

const sendEmail = async ({ email, subject, html }) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject,
    html,
  });
};

export default sendEmail;
