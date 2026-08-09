import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!process.env.SMTP_USER) {
      console.log(`[MailService Simulated] To: ${to} | Subject: ${subject}`);
      return { success: true, simulated: true };
    }
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Lumio Goa'}" <${process.env.EMAIL_FROM || 'noreply@lumio.dev'}>`,
      to,
      subject,
      text,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Mail service error:', error);
    return { success: false, error: error.message };
  }
};

export default { sendEmail };
