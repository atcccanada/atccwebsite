const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/login', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/admin/dashboard');
    }
    res.render('auth/login', { 
        title: 'ATCC - Login',
        page: 'login',
        error: null,
        user: req.user || null
    });
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user || !await user.comparePassword(password)) {
            return res.render('auth/login', { 
                title: 'ATCC - Login',
                page: 'login',
                error: 'Invalid email or password',
                user: null
            });
        }

        if (!user.isActive) {
            return res.render('auth/login', { 
                title: 'ATCC - Login',
                page: 'login',
                error: 'Account is deactivated. Please contact admin.',
                user: null
            });
        }

        req.session.userId = user._id;
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', { 
            title: 'ATCC - Login',
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
        title: 'ATCC - Register',
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
                title: 'ATCC - Register',
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
        req.session.userId = user._id;
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Registration error:', error);
        res.render('auth/register', { 
            title: 'ATCC - Register',
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