const nodemailer = require('nodemailer');

// Email configuration
const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
    }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration
const verifyConnection = async () => {
    try {
        await transporter.verify();
        console.log('Email server is ready to take our messages');
        return true;
    } catch (error) {
        console.warn('Email server connection failed:', error.message);
        return false;
    }
};

// Send email function
const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || '"ATCC Website" <noreply@atcccanada.ca>',
            to: options.to || 'info@atcccanada.ca',
            subject: options.subject,
            text: options.text,
            html: options.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

// Email templates
const emailTemplates = {
    contactForm: (data) => ({
        subject: `Contact Form Submission from ${data.name}`,
        text: `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Subject: ${data.subject || 'General Inquiry'}

Message:
${data.message}

---
Sent from ATCC Website Contact Form
        `,
        html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #FF6F0F; border-bottom: 2px solid #FF6F0F; padding-bottom: 10px;">
        Contact Form Submission
    </h2>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${data.subject || 'General Inquiry'}</p>
    </div>
    
    <div style="margin: 20px 0;">
        <h3 style="color: #001D23;">Message:</h3>
        <div style="background: white; padding: 15px; border-left: 4px solid #FF6F0F;">
            ${data.message.replace(/\n/g, '<br>')}
        </div>
    </div>
    
    <div style="margin-top: 30px; padding: 15px; background: #FFF0E6; border-radius: 5px; text-align: center;">
        <p style="margin: 0; color: #666; font-size: 14px;">
            This message was sent from the ATCC Website Contact Form<br>
            <strong>Association of Tamil Canadian Community</strong>
        </p>
    </div>
</div>
        `
    }),

    volunteerRegistration: (data) => ({
        subject: `Volunteer Registration from ${data.firstName} ${data.lastName}`,
        text: `
New Volunteer Registration:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Skills: ${data.skills || 'Not specified'}
Availability: ${data.availability || 'Not specified'}
Previous Experience: ${data.experience || 'None provided'}

Additional Information:
${data.additionalInfo || 'None provided'}

---
Sent from ATCC Website Volunteer Registration Form
        `,
        html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #FF6F0F; border-bottom: 2px solid #FF6F0F; padding-bottom: 10px;">
        New Volunteer Registration
    </h2>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Skills:</strong> ${data.skills || 'Not specified'}</p>
        <p><strong>Availability:</strong> ${data.availability || 'Not specified'}</p>
    </div>
    
    <div style="margin: 20px 0;">
        <h3 style="color: #001D23;">Previous Experience:</h3>
        <div style="background: white; padding: 15px; border-left: 4px solid #FF6F0F;">
            ${(data.experience || 'None provided').replace(/\n/g, '<br>')}
        </div>
    </div>
    
    <div style="margin: 20px 0;">
        <h3 style="color: #001D23;">Additional Information:</h3>
        <div style="background: white; padding: 15px; border-left: 4px solid #FF6F0F;">
            ${(data.additionalInfo || 'None provided').replace(/\n/g, '<br>')}
        </div>
    </div>
    
    <div style="margin-top: 30px; padding: 15px; background: #FFF0E6; border-radius: 5px; text-align: center;">
        <p style="margin: 0; color: #666; font-size: 14px;">
            This registration was submitted from the ATCC Website<br>
            <strong>Association of Tamil Canadian Community</strong>
        </p>
    </div>
</div>
        `
    })
};

module.exports = {
    transporter,
    verifyConnection,
    sendEmail,
    emailTemplates
};