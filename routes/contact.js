const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendEmail, emailTemplates } = require('../config/email');
const { contactLimiter } = require('../middleware/rateLimiting');
const router = express.Router();

// Contact form validation rules
const contactValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('phone')
        .optional()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Please provide a valid phone number'),
    body('subject')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Subject must be less than 200 characters'),
    body('message')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Message must be between 10 and 2000 characters')
];

// Volunteer registration validation rules
const volunteerValidation = [
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('phone')
        .optional()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Please provide a valid phone number'),
    body('skills')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Skills description must be less than 500 characters'),
    body('availability')
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage('Availability description must be less than 300 characters'),
    body('experience')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Experience description must be less than 1000 characters'),
    body('additionalInfo')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Additional information must be less than 1000 characters')
];

// Handle contact form submission
router.post('/submit', contactLimiter, contactValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.render('contact', {
                title: 'ATCC - Contact',
                page: 'contact',
                user: req.user || null,
                errors: errors.array(),
                formData: req.body,
                success: false
            });
        }

        const { name, email, phone, subject, message } = req.body;
        
        // Prepare email content
        const emailContent = emailTemplates.contactForm({
            name,
            email,
            phone,
            subject,
            message
        });

        // Send email
        const result = await sendEmail({
            to: 'info@atcccanada.ca',
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html
        });

        if (result.success) {
            res.render('contact', {
                title: 'ATCC - Contact',
                page: 'contact',
                user: req.user || null,
                errors: [],
                formData: {},
                success: true,
                message: 'Thank you for your message! We will get back to you soon.'
            });
        } else {
            res.render('contact', {
                title: 'ATCC - Contact',
                page: 'contact',
                user: req.user || null,
                errors: [{ msg: 'There was an error sending your message. Please try again later.' }],
                formData: req.body,
                success: false
            });
        }
    } catch (error) {
        console.error('Contact form error:', error);
        res.render('contact', {
            title: 'ATCC - Contact',
            page: 'contact',
            user: req.user || null,
            errors: [{ msg: 'An unexpected error occurred. Please try again later.' }],
            formData: req.body,
            success: false
        });
    }
});

// Handle volunteer registration
router.post('/volunteer', contactLimiter, volunteerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.render('contact', {
                title: 'ATCC - Contact',
                page: 'contact',
                user: req.user || null,
                volunteerErrors: errors.array(),
                volunteerFormData: req.body,
                volunteerSuccess: false,
                errors: [],
                formData: {},
                success: false
            });
        }

        const {
            firstName,
            lastName,
            email,
            phone,
            skills,
            availability,
            experience,
            additionalInfo
        } = req.body;
        
        // Prepare email content
        const emailContent = emailTemplates.volunteerRegistration({
            firstName,
            lastName,
            email,
            phone,
            skills,
            availability,
            experience,
            additionalInfo
        });

        // Send email
        const result = await sendEmail({
            to: 'info@atcccanada.ca',
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html
        });

        if (result.success) {
            res.render('contact', {
                title: 'ATCC - Contact',
                page: 'contact',
                user: req.user || null,
                volunteerErrors: [],
                volunteerFormData: {},
                volunteerSuccess: true,
                volunteerMessage: 'Thank you for your interest in volunteering! We will contact you soon.',
                errors: [],
                formData: {},
                success: false
            });
        } else {
            res.render('contact', {
                title: 'ATCC - Contact',
                page: 'contact',
                user: req.user || null,
                volunteerErrors: [{ msg: 'There was an error submitting your registration. Please try again later.' }],
                volunteerFormData: req.body,
                volunteerSuccess: false,
                errors: [],
                formData: {},
                success: false
            });
        }
    } catch (error) {
        console.error('Volunteer registration error:', error);
        res.render('contact', {
            title: 'ATCC - Contact',
            page: 'contact',
            user: req.user || null,
            volunteerErrors: [{ msg: 'An unexpected error occurred. Please try again later.' }],
            volunteerFormData: req.body,
            volunteerSuccess: false,
            errors: [],
            formData: {},
            success: false
        });
    }
});

module.exports = router;