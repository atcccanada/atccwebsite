const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const User = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');
const { adminLimiter, createContentLimiter } = require('../middleware/rateLimiting');
const router = express.Router();

router.get('/dashboard', adminLimiter, requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const totalBlogs = await Blog.countDocuments({ author: user._id });
        const publishedBlogs = await Blog.countDocuments({ 
            author: user._id, 
            status: 'published' 
        });
        const draftBlogs = await Blog.countDocuments({ 
            author: user._id, 
            status: 'draft' 
        });

        const recentBlogs = await Blog.find({ author: user._id })
            .sort({ updatedAt: -1 })
            .limit(5);

        res.render('admin/dashboard', {
            title: 'ATCC - Admin Dashboard',
            description: 'ATCC admin dashboard for managing community content and events',
            keywords: 'ATCC admin, dashboard, content management',
            url: 'https://atcccanada.org/admin/dashboard',
            ogImage: 'https://atcccanada.org/img/admin-panel.jpg',
            page: 'admin',
            user,
            stats: {
                totalBlogs,
                publishedBlogs,
                draftBlogs
            },
            recentBlogs
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).render('500', { 
            title: 'Server Error',
            page: '500',
            user: req.user || null
        });
    }
});

router.get('/blogs', requireAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        
        const user = await User.findById(req.session.userId);
        let query = {};
        
        if (user.role !== 'admin') {
            query.author = user._id;
        }
        
        if (req.query.status) {
            query.status = req.query.status;
        }

        const blogs = await Blog.find(query)
            .populate('author', 'firstName lastName username')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBlogs = await Blog.countDocuments(query);
        const totalPages = Math.ceil(totalBlogs / limit);

        res.render('admin/blogs', {
            title: 'ATCC - Manage Blogs',
            page: 'admin',
            blogs,
            currentPage: page,
            totalPages,
            selectedStatus: req.query.status || '',
            user
        });
    } catch (error) {
        console.error('Blogs listing error:', error);
        res.status(500).render('500', { 
            title: 'Server Error',
            page: '500',
            user: req.user || null
        });
    }
});

router.get('/blog/new', requireAuth, (req, res) => {
    res.render('admin/blog-form', {
        title: 'ATCC - New Blog Post',
        page: 'admin',
        blog: null,
        user: req.user,
        error: null
    });
});

// Blog validation middleware
const blogValidation = [
    body('title').notEmpty().trim().isLength({ min: 1, max: 200 }).escape(),
    body('content').notEmpty().trim().isLength({ min: 10, max: 50000 }),
    body('excerpt').optional().trim().isLength({ max: 500 }).escape(),
    body('category').optional().isIn(['technology', 'community', 'events', 'culture', 'business', 'education']),
    body('status').optional().isIn(['draft', 'published', 'archived']),
    body('tags').optional().trim()
];

router.post('/blog/new', createContentLimiter, requireAuth, blogValidation, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('admin/blog-form', {
                title: 'Create New Blog Post - ATCC Admin',
                page: 'admin',
                user: req.user,
                blog: null,
                errors: errors.array(),
                formData: req.body
            });
        }

        // Use validated data from blogValidation middleware
        const title = req.body.title;
        const content = req.body.content;
        const excerpt = req.body.excerpt;
        const tags = req.body.tags;
        const category = req.body.category;
        const status = req.body.status;
        
        // Additional type validation
        if (typeof title !== 'string' || typeof content !== 'string') {
            return res.status(400).render('admin/blog-form', {
                title: 'Create New Blog Post - ATCC Admin',
                page: 'admin',
                user: req.user,
                blog: null,
                errors: [{ msg: 'Invalid data format' }],
                formData: req.body
            });
        }
        
        const user = await User.findById(req.session.userId);
        
        const blog = new Blog({
            title: title,
            content: content,
            excerpt: excerpt,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            category: category,
            status,
            author: user._id
        });

        await blog.save();
        res.redirect('/admin/blogs');
    } catch (error) {
        console.error('Blog creation error:', error);
        res.render('admin/blog-form', {
            title: 'ATCC - New Blog Post',
            page: 'admin',
            blog: null,
            user: req.user,
            error: 'An error occurred while creating the blog post.'
        });
    }
});

router.get('/blog/:id/edit', requireAuth, validateObjectId('id'), async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        let query = { _id: req.params.id };
        
        if (user.role !== 'admin') {
            query.author = user._id;
        }

        const blog = await Blog.findOne(query);
        
        if (!blog) {
            return res.status(404).render('404', { 
                title: 'Blog Not Found',
                page: '404',
                user
            });
        }

        res.render('admin/blog-form', {
            title: 'ATCC - Edit Blog Post',
            page: 'admin',
            blog,
            user,
            error: null
        });
    } catch (error) {
        console.error('Blog edit error:', error);
        res.status(500).render('500', { 
            title: 'Server Error',
            page: '500',
            user: req.user || null
        });
    }
});

router.post('/blog/:id/edit', adminLimiter, requireAuth, validateObjectId('id'), blogValidation, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const blog = await Blog.findById(req.params.id);
            return res.status(400).render('admin/blog-form', {
                title: 'Edit Blog Post - ATCC Admin',
                page: 'admin',
                user: req.user,
                blog: blog,
                errors: errors.array(),
                formData: req.body
            });
        }

        // Use validated data from blogValidation middleware
        const title = req.body.title;
        const content = req.body.content;
        const excerpt = req.body.excerpt;
        const tags = req.body.tags;
        const category = req.body.category;
        const status = req.body.status;
        
        // Additional type validation
        if (typeof title !== 'string' || typeof content !== 'string') {
            return res.status(400).render('admin/blog-form', {
                title: 'Edit Blog Post - ATCC Admin',
                page: 'admin',
                user: req.user,
                blog: await Blog.findById(req.params.id),
                errors: [{ msg: 'Invalid data format' }],
                formData: req.body
            });
        }
        
        const user = await User.findById(req.session.userId);
        
        // Create update operation with $set for security
        const updateOperation = {
            $set: {
                title: title,
                content: content,
                excerpt: excerpt,
                tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
                category: category,
                status: status
            }
        };
        
        let blog;
        if (user.role === 'admin') {
            // Admin can update any blog
            blog = await Blog.findByIdAndUpdate(req.params.id, updateOperation, { new: true });
        } else {
            // Non-admin can only update their own blogs
            blog = await Blog.findOneAndUpdate(
                { _id: req.params.id, author: user._id },
                updateOperation,
                { new: true }
            );
        }

        if (!blog) {
            return res.status(404).render('404', { 
                title: 'Blog Not Found',
                page: '404',
                user
            });
        }

        res.redirect('/admin/blogs');
    } catch (error) {
        console.error('Blog update error:', error);
        const blog = await Blog.findById(req.params.id);
        res.render('admin/blog-form', {
            title: 'ATCC - Edit Blog Post',
            page: 'admin',
            blog,
            user: req.user,
            error: 'An error occurred while updating the blog post.'
        });
    }
});

router.post('/blog/:id/delete', adminLimiter, requireRole(['admin', 'editor']), validateObjectId('id'), async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        let query = { _id: req.params.id };
        
        if (user.role !== 'admin') {
            query.author = user._id;
        }

        await Blog.findOneAndDelete(query);
        res.redirect('/admin/blogs');
    } catch (error) {
        console.error('Blog deletion error:', error);
        res.redirect('/admin/blogs');
    }
});

module.exports = router;