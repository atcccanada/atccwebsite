const mongoose = require('mongoose');

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid ObjectId, false otherwise
 */
function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Middleware to validate ObjectId parameters
 * @param {string} paramName - The parameter name to validate (default: 'id')
 * @returns {Function} - Express middleware function
 */
function validateObjectId(paramName = 'id') {
    return (req, res, next) => {
        const id = req.params[paramName];
        
        if (!id) {
            return res.status(400).json({ error: `Missing ${paramName} parameter` });
        }
        
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: `Invalid ${paramName} format` });
        }
        
        next();
    };
}

/**
 * Sanitizes input to prevent NoSQL injection
 * @param {*} input - The input to sanitize
 * @returns {*} - Sanitized input
 */
function sanitizeInput(input) {
    if (typeof input === 'object' && input !== null) {
        // Remove operators that could be used for NoSQL injection
        const sanitized = {};
        for (const [key, value] of Object.entries(input)) {
            if (!key.startsWith('$') && key !== '__proto__') {
                sanitized[key] = sanitizeInput(value);
            }
        }
        return sanitized;
    }
    return input;
}

/**
 * Escapes special regex characters to prevent ReDoS attacks
 * @param {string} string - The string to escape
 * @returns {string} - Escaped string safe for regex
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Creates a safe case-insensitive regex for search queries
 * @param {string} searchTerm - The search term
 * @returns {RegExp|null} - Safe regex or null if invalid
 */
function createSafeRegex(searchTerm) {
    if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.length > 100) {
        return null;
    }
    
    // Escape special regex characters and create case-insensitive regex
    const escapedTerm = escapeRegExp(searchTerm.trim());
    if (escapedTerm.length === 0) {
        return null;
    }
    
    return new RegExp(escapedTerm, 'i');
}

/**
 * Middleware to sanitize request body, query, and params
 */
function sanitizeRequest(req, res, next) {
    if (req.body) {
        req.body = sanitizeInput(req.body);
    }
    if (req.query) {
        req.query = sanitizeInput(req.query);
    }
    if (req.params) {
        req.params = sanitizeInput(req.params);
    }
    next();
}

module.exports = {
    isValidObjectId,
    validateObjectId,
    sanitizeInput,
    sanitizeRequest,
    escapeRegExp,
    createSafeRegex
};