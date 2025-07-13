const express = require('express');
const User = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/auth');
const router = express.Router();

// User management - Admin only
router.get('/admin/users', requireRole(['admin']), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const skip = (page - 1) * limit;
        
        let query = {};
        
        if (req.query.role) {
            query.role = req.query.role;
        }
        
        if (req.query.status) {
            query.isActive = req.query.status === 'active';
        }

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-password'); // Don't send password

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        res.render('admin/users', {
            title: 'ATCC - Manage Users',
            description: 'Admin panel for managing user accounts and roles',
            keywords: 'ATCC admin, user management, roles',
            url: 'https://atcccanada.org/admin/users',
            ogImage: 'https://atcccanada.org/img/admin-panel.jpg',
            page: 'admin',
            users,
            currentPage: page,
            totalPages,
            filters: {
                role: req.query.role || '',
                status: req.query.status || ''
            },
            user: req.user
        });
    } catch (error) {
        console.error('User management error:', error);
        res.status(500).render('500', {
            title: 'Server Error',
            description: 'Internal server error occurred',
            keywords: 'error, server error',
            url: 'https://atcccanada.org/500',
            ogImage: 'https://atcccanada.org/img/error.jpg',
            page: '500',
            user: req.user || null
        });
    }
});

// Update user role - Admin only
router.post('/admin/users/:id/role', requireRole(['admin']), async (req, res) => {
    try {
        const { role } = req.body;
        const validRoles = ['admin', 'editor', 'author', 'user'];
        
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        user.role = role;
        await user.save();
        
        res.json({ success: true, message: 'User role updated successfully' });
    } catch (error) {
        console.error('Role update error:', error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// Toggle user status - Admin only
router.post('/admin/users/:id/toggle-status', requireRole(['admin']), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        user.isActive = !user.isActive;
        await user.save();
        
        res.json({ 
            success: true, 
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            isActive: user.isActive
        });
    } catch (error) {
        console.error('Status toggle error:', error);
        res.status(500).json({ error: 'Failed to update user status' });
    }
});

module.exports = router;