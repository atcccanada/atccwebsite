const express = require('express');
const Blog = require('../models/Blog');
const User = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', requireAuth, async (req, res) => {
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

router.post('/blog/new', requireAuth, async (req, res) => {
    try {
        const { title, content, excerpt, tags, category, status } = req.body;
        const user = await User.findById(req.session.userId);
        
        const blog = new Blog({
            title,
            content,
            excerpt,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            category,
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

router.get('/blog/:id/edit', requireAuth, async (req, res) => {
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

router.post('/blog/:id/edit', requireAuth, async (req, res) => {
    try {
        const { title, content, excerpt, tags, category, status } = req.body;
        const user = await User.findById(req.session.userId);
        
        let query = { _id: req.params.id };
        if (user.role !== 'admin') {
            query.author = user._id;
        }

        const blog = await Blog.findOneAndUpdate(query, {
            title,
            content,
            excerpt,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            category,
            status
        }, { new: true });

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

router.post('/blog/:id/delete', requireRole(['admin', 'editor']), async (req, res) => {
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