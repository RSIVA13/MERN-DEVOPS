const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
  // Log environment variables (just for debugging — remove in production)
  // console.log("SMTP_SERVICE:", process.env.SMTP_SERVICE);
  // console.log("SMTP_MAIL:", process.env.SMTP_MAIL);
  // console.log("SMTP_PASSWORD:", process.env.SMTP_PASSWORD ? "✅ Loaded" : "❌ Missing");

  const transporter = nodeMailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Error sending email:", error); // 👈 This will help you debug
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
