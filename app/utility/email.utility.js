const nodemailer = require('nodemailer');

let cachedTransporter = null;

/**
 * Create and cache SMTP transporter
 * Microsoft SMTP: AUTH REQUIRED, NO TLS
 */
async function createTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const transporter = nodemailer.createTransport({
    host: 'smtp.belectriq.co',
    port: 25,
    secure: false,          // no SSL
    auth: {
      user: 'smtpuser',     // ✅ EXACT USER
      pass: 'BEEmail@32123',
    },
    ignoreTLS: true,        // 🔥 IMPORTANT: disables STARTTLS
  });

  await transporter.verify();
  console.log('✅ Connected to smtp.belectriq.co on port 25 (AUTH, NO TLS)');

  cachedTransporter = transporter;
  return transporter;
}

/**
 * Send an email
 */
async function sendEmail(to, subject, html, attachments = []) {
  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: '"BelectriQ" <noreply@belectriq.co>', // ✅ allowed sender
      to,
      subject,
      html,
      text: html.replace(/<[^>]+>/g, ''),
      attachments,
    });

    console.log('✅ Email sent successfully:', info.response);
    return true;
  } catch (err) {
    console.error('❌ Email sending failed FULL ERROR:', err);
    return false;
  }
}

/**
 * Forgot Password – Send OTP email
 */
async function sendForgotPasswordOTP(toEmail, otp) {
  const subject = 'BelectriQ - Password Reset OTP';

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Password Reset Request</h2>
      <p>Your One-Time Password (OTP) is:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>This OTP is valid for <b>10 minutes</b>.</p>
      <p>If you did not request this, please ignore this email.</p>
      <br/>
      <p>Regards,<br/>BelectriQ Team</p>
    </div>
  `;

  return await sendEmail(toEmail, subject, html);
}

module.exports = {
  sendEmail,
  sendForgotPasswordOTP,
};
