import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_EMAIL_ADDRESS, // Your Gmail email address
      pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail email password or an App Password
    },
  });
}

export async function sendVerificationEmail(
  toEmail: string,
  verificationCode: string
) {
  const transporter = createTransporter();

  const mailOptions = {
    from: "zaccheausjide@gmail.com",
    to: toEmail,
    subject: "Verification Code for Your Account",
    text: `Your verification code is: ${verificationCode}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}

export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a random 6-digit code
}

export function generateExpirationTime() {
  return new Date(Date.now() + 5 * 60 * 1000);
}
