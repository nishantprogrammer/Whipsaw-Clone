const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendContactEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, subject, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER,
    subject: `Contact Form: ${subject || 'No Subject'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #FF3B30; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        <div style="margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject || 'No Subject'}</p>
        </div>
        <div style="margin: 20px 0;">
          <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; border-left: 4px solid #FF3B30;">
            ${message}
          </div>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p>This message was sent from the Whipsaw Clone contact form.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
};
