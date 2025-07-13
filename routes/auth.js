const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authLimiter } = require('../middleware/rateLimiting');
const router = express.Router();

router.get('/login', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/admin/dashboard');
    }
    res.render('auth/login', { 
        title: 'ATCC Login - Admin Access | Association of Tamilnadu Canadian Community',
        description: 'Login to access the ATCC admin dashboard for managing events, blogs, and community content.',
        keywords: 'ATCC login, admin access, Tamil community admin',
        url: 'https://atcccanada.org/auth/login',
        ogImage: 'https://atcccanada.org/img/login-banner.jpg',
        page: 'login',
        error: null,
        user: req.user || null
    });
});

// Login validation
const loginValidation = [
    body('email').isEmail().normalizeEmail().trim().escape(),
    body('password').isLength({ min: 1 }).trim()
];

router.post('/login', authLimiter, loginValidation, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('auth/login', { 
                title: 'ATCC Login - Admin Access | Association of Tamilnadu Canadian Community',
                description: 'Login to access the ATCC admin dashboard for managing events, blogs, and community content.',
                keywords: 'ATCC login, admin access, Tamil community admin',
                url: 'https://atcccanada.org/auth/login',
                ogImage: 'https://atcccanada.org/img/login-banner.jpg',
                page: 'login',
                error: 'Invalid email or password format.',
                user: null
            });
        }

        // Use validated and sanitized data from express-validator
        const email = req.body.email; // This has been validated and sanitized by loginValidation middleware
        const password = req.body.password;
        
        // Additional validation to ensure email is a string and not an object
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.render('auth/login', { 
                title: 'ATCC Login - Admin Access | Association of Tamilnadu Canadian Community',
                description: 'Login to access the ATCC admin dashboard for managing events, blogs, and community content.',
                keywords: 'ATCC login, admin access, Tamil community admin',
                url: 'https://atcccanada.org/auth/login',
                ogImage: 'https://atcccanada.org/img/login-banner.jpg',
                page: 'login',
                error: 'Invalid credentials format.',
                user: null
            });
        }
        
        const user = await User.findOne({ email: email });
        if (!user || !await user.comparePassword(password)) {
            return res.render('auth/login', { 
                title: 'ATCC Login - Admin Access | Association of Tamilnadu Canadian Community',
                description: 'Login to access the ATCC admin dashboard for managing events, blogs, and community content.',
                keywords: 'ATCC login, admin access, Tamil community admin',
                url: 'https://atcccanada.org/auth/login',
                ogImage: 'https://atcccanada.org/img/login-banner.jpg',
                page: 'login',
                error: 'Invalid email or password',
                user: null
            });
        }

        if (!user.isActive) {
            return res.render('auth/login', { 
                title: 'ATCC Login - Admin Access | Association of Tamilnadu Canadian Community',
                description: 'Login to access the ATCC admin dashboard for managing events, blogs, and community content.',
                keywords: 'ATCC login, admin access, Tamil community admin',
                url: 'https://atcccanada.org/auth/login',
                ogImage: 'https://atcccanada.org/img/login-banner.jpg',
                page: 'login',
                error: 'Account is deactivated. Please contact admin.',
                user: null
            });
        }

        // Regenerate session to prevent session fixation attacks
        req.session.regenerate((err) => {
            if (err) {
                console.error('Session regeneration error:', err);
                return res.render('auth/login', { 
                    title: 'ATCC Login - Admin Access | Association of Tamilnadu Canadian Community',
                    description: 'Login to access the ATCC admin dashboard for managing events, blogs, and community content.',
                    keywords: 'ATCC login, admin access, Tamil community admin',
                    url: 'https://atcccanada.org/auth/login',
                    ogImage: 'https://atcccanada.org/img/login-banner.jpg',
                    page: 'login',
                    error: 'Session error. Please try again.',
                    user: null
                });
            }
            
            req.session.userId = user._id;
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.render('auth/login', { 
                        title: 'ATCC Login - Admin Access | Association of Tamilnadu Canadian Community',
                        description: 'Login to access the ATCC admin dashboard for managing events, blogs, and community content.',
                        keywords: 'ATCC login, admin access, Tamil community admin',
                        url: 'https://atcccanada.org/auth/login',
                        ogImage: 'https://atcccanada.org/img/login-banner.jpg',
                        page: 'login',
                        error: 'Login error. Please try again.',
                        user: null
                    });
                }
                res.redirect('/admin/dashboard');
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', { 
            title: 'ATCC Login - Admin Access | Association of Tamilnadu Canadian Community',
            description: 'Login to access the ATCC admin dashboard for managing events, blogs, and community content.',
            keywords: 'ATCC login, admin access, Tamil community admin',
            url: 'https://atcccanada.org/auth/login',
            ogImage: 'https://atcccanada.org/img/login-banner.jpg',
            page: 'login',
            error: 'An error occurred. Please try again.',
            user: null
        });
    }
});

router.get('/register', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/admin/dashboard');
    }
    res.render('auth/register', { 
        title: 'ATCC Registration - Create Admin Account | Association of Tamilnadu Canadian Community',
        description: 'Register for an ATCC admin account to contribute content, manage events, and help build the Tamil Canadian community.',
        keywords: 'ATCC registration, admin account, Tamil community contributor',
        url: 'https://atcccanada.org/auth/register',
        ogImage: 'https://atcccanada.org/img/register-banner.jpg',
        page: 'register',
        error: null,
        user: req.user || null
    });
});

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;
        
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }]
        });
        
        if (existingUser) {
            return res.render('auth/register', { 
                title: 'ATCC Registration - Create Admin Account | Association of Tamilnadu Canadian Community',
                description: 'Register for an ATCC admin account to contribute content, manage events, and help build the Tamil Canadian community.',
                keywords: 'ATCC registration, admin account, Tamil community contributor',
                url: 'https://atcccanada.org/auth/register',
                ogImage: 'https://atcccanada.org/img/register-banner.jpg',
                page: 'register',
                error: 'Email or username already exists',
                user: null
            });
        }

        const user = new User({
            username,
            email,
            password,
            firstName,
            lastName,
            role: 'author'
        });

        await user.save();
        
        // Regenerate session to prevent session fixation attacks
        req.session.regenerate((err) => {
            if (err) {
                console.error('Session regeneration error:', err);
                return res.render('auth/register', { 
                    title: 'ATCC Registration - Create Admin Account | Association of Tamilnadu Canadian Community',
                    description: 'Register for an ATCC admin account to contribute content, manage events, and help build the Tamil Canadian community.',
                    keywords: 'ATCC registration, admin account, Tamil community contributor',
                    url: 'https://atcccanada.org/auth/register',
                    ogImage: 'https://atcccanada.org/img/register-banner.jpg',
                    page: 'register',
                    error: 'Session error. Please try again.',
                    user: null
                });
            }
            
            req.session.userId = user._id;
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.render('auth/register', { 
                        title: 'ATCC Registration - Create Admin Account | Association of Tamilnadu Canadian Community',
                        description: 'Register for an ATCC admin account to contribute content, manage events, and help build the Tamil Canadian community.',
                        keywords: 'ATCC registration, admin account, Tamil community contributor',
                        url: 'https://atcccanada.org/auth/register',
                        ogImage: 'https://atcccanada.org/img/register-banner.jpg',
                        page: 'register',
                        error: 'Registration error. Please try again.',
                        user: null
                    });
                }
                res.redirect('/admin/dashboard');
            });
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.render('auth/register', { 
            title: 'ATCC Registration - Create Admin Account | Association of Tamilnadu Canadian Community',
            description: 'Register for an ATCC admin account to contribute content, manage events, and help build the Tamil Canadian community.',
            keywords: 'ATCC registration, admin account, Tamil community contributor',
            url: 'https://atcccanada.org/auth/register',
            ogImage: 'https://atcccanada.org/img/register-banner.jpg',
            page: 'register',
            error: 'An error occurred. Please try again.',
            user: null
        });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

module.exports = router;