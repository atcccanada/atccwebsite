const User = require('../models/User');

const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

const requireRole = (roles) => {
    return async (req, res, next) => {
        try {
            if (!req.session.userId) {
                return res.redirect('/login');
            }

            const user = await User.findById(req.session.userId);
            if (!user || !roles.includes(user.role)) {
                return res.status(403).render('403', { 
                    title: 'Access Denied',
                    page: '403'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            res.status(500).render('500', { 
                title: 'Server Error',
                page: '500'
            });
        }
    };
};

const checkAuth = async (req, res, next) => {
    if (req.session.userId) {
        try {
            const user = await User.findById(req.session.userId);
            req.user = user;
        } catch (error) {
            console.error('Check auth error:', error);
        }
    }
    next();
};

module.exports = {
    requireAuth,
    requireRole,
    checkAuth
};