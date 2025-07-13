const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;
        
        const query = { status: 'published' };
        
        if (req.query.category) {
            query.category = req.query.category;
        }
        
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }

        const blogs = await Blog.find(query)
            .populate('author', 'firstName lastName username role')
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBlogs = await Blog.countDocuments(query);
        const totalPages = Math.ceil(totalBlogs / limit);

        const categories = await Blog.distinct('category', { status: 'published' });

        res.render('blog/index', {
            title: 'ATCC Blog - Tamil Community Stories & Updates | Association of Tamil Community Canada',
            description: 'Read the latest stories, community updates, and insights from the Tamil Canadian community. Discover cultural events, success stories, and news from ATCC volunteers and members.',
            keywords: 'ATCC blog, Tamil community blog, Tamil Canadian stories, ATCC news, Tamil culture articles, community updates Canada',
            url: 'https://atcccanada.org/blog',
            ogImage: 'https://atcccanada.org/img/blog-banner.jpg',
            page: 'blog',
            blogs,
            currentPage: page,
            totalPages,
            categories,
            selectedCategory: req.query.category || '',
            searchQuery: req.query.search || '',
            user: req.user || null
        });
    } catch (error) {
        console.error('Blog listing error:', error);
        res.status(500).render('500', { 
            title: 'Server Error',
            page: '500',
            user: req.user || null
        });
    }
});

router.get('/:slug', async (req, res) => {
    try {
        const blog = await Blog.findOne({ 
            slug: req.params.slug, 
            status: 'published' 
        }).populate('author', 'firstName lastName username role');

        if (!blog) {
            return res.status(404).render('404', { 
                title: 'Blog Post Not Found',
                page: '404',
                user: req.user || null
            });
        }

        await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

        const relatedBlogs = await Blog.find({
            _id: { $ne: blog._id },
            category: blog.category,
            status: 'published'
        })
        .populate('author', 'firstName lastName username role')
        .sort({ publishedAt: -1 })
        .limit(3);

        res.render('blog/post', {
            title: `${blog.title} | ATCC Blog - Tamil Community Canada`,
            description: blog.excerpt || `${blog.content.substring(0, 155)}...`,
            keywords: `${blog.tags ? blog.tags.join(', ') + ', ' : ''}ATCC blog, Tamil community, ${blog.category}, Tamil Canadian community`,
            url: `https://atcccanada.org/blog/${blog.slug}`,
            ogImage: blog.featuredImage || 'https://atcccanada.org/img/blog-default.jpg',
            page: 'blog',
            blog,
            relatedBlogs,
            user: req.user || null
        });
    } catch (error) {
        console.error('Blog post error:', error);
        res.status(500).render('500', { 
            title: 'Server Error',
            page: '500',
            user: req.user || null
        });
    }
});

module.exports = router;