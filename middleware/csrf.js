const Tokens = require('csrf');

// Create CSRF tokens instance
const tokens = new Tokens();

/**
 * CSRF protection middleware
 */
function csrfProtection(req, res, next) {
    // Skip CSRF for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        // Generate and provide CSRF token for safe methods
        if (!req.session.csrfSecret) {
            req.session.csrfSecret = tokens.secretSync();
        }
        
        const token = tokens.create(req.session.csrfSecret);
        res.locals.csrfToken = token;
        req.csrfToken = () => token;
        
        return next();
    }
    
    // Verify CSRF token for unsafe methods
    const token = req.body._csrf || req.headers['x-csrf-token'] || req.headers['csrf-token'];
    const secret = req.session.csrfSecret;
    
    if (!secret || !token) {
        const error = new Error('CSRF token missing');
        error.status = 403;
        return next(error);
    }
    
    if (!tokens.verify(secret, token)) {
        const error = new Error('Invalid CSRF token');
        error.status = 403;
        return next(error);
    }
    
    // Token is valid, proceed
    res.locals.csrfToken = token;
    req.csrfToken = () => token;
    next();
}

/**
 * Middleware to skip CSRF protection for specific routes
 */
function skipCSRF(req, res, next) {
    req.skipCSRF = true;
    next();
}

/**
 * Conditional CSRF middleware that checks if CSRF should be skipped
 */
function conditionalCSRF(req, res, next) {
    if (req.skipCSRF) {
        return next();
    }
    return csrfProtection(req, res, next);
}

module.exports = {
    csrfProtection,
    skipCSRF,
    conditionalCSRF
};