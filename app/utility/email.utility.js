const nodemailer = require('nodemailer');

let cachedTransporter = null;

/**
 * Create and cache a mail transporter (SMTP)
 */
async function createTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const transporter = nodemailer.createTransport({
    host: 'smtp.belectriq.co',
    port: 25,
    secure: false,
    auth: {
      user: 'smtpuser',
      pass: 'BEEmail@32123',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.verify();
  console.log('✅ Connected to smtp.belectriq.co on port 25');

  cachedTransporter = transporter;
  return transporter;
}

/**
 * Send an email with optional attachments
 * @param {string} to - Recipient email
 * @param {string} subject - Subject line
 * @param {string} html - HTML body
 * @param {Array} attachments - Optional attachments [{ filename, path, contentType }]
 */
async function sendEmail(to, subject, html, attachments = []) {
  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: '"BelectriQ" <noreply@belectriq.co>',
      to,
      subject,
      html,
      text: html.replace(/<[^>]+>/g, ''), // plain text fallback
      attachments,
    });

    console.log(`✅ Email sent to ${to} (Message ID: ${info.messageId})`);
    return true;
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
    return false;
  }
}

module.exports = { sendEmail };
