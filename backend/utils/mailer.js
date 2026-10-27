const nodemailer = require("nodemailer");

function createTransporter() {
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT || "587";
  const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL;
  const SMTP_PASS = process.env.SMTP_PASS || process.env.PASSWORD;
  const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    throw new Error("SMTP email settings are incomplete");
  }

  const port = Number(SMTP_PORT);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

async function sendMail({ to, subject, text }) {
  const transporter = createTransporter();
  return transporter.sendMail({ from: process.env.EMAIL_FROM || process.env.EMAIL, to, subject, text });
}

module.exports = { sendMail };