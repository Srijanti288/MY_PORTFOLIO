// ------------------ IMPORTS ------------------
import nodemailer from "nodemailer";

// ------------------ SEND EMAIL FUNCTION ------------------
export const sendEmail = async (options) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE, // e.g. Gmail, SendGrid, etc.
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Define email options
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${options.email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error; // rethrow so controller can handle
  }
};
