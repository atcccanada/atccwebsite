const express = require('express');
const Event = require('../models/Event');
const { requireAuth, requireRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const currentDate = new Date();
        
        let upcomingEvents = await Event.find({
            startDate: { $gte: currentDate },
            status: { $in: ['upcoming', 'ongoing'] }
        })
        .populate('organizer', 'firstName lastName')
        .sort({ startDate: 1 })
        .limit(6);

        let pastEvents = await Event.find({
            endDate: { $lt: currentDate },
            status: 'completed'
        })
        .populate('organizer', 'firstName lastName')
        .sort({ startDate: -1 })
        .limit(6);

        if (req.query.category) {
            const categoryFilter = { category: req.query.category };
            upcomingEvents = await Event.find({
                ...categoryFilter,
                startDate: { $gte: currentDate },
                status: { $in: ['upcoming', 'ongoing'] }
            })
            .populate('organizer', 'firstName lastName')
            .sort({ startDate: 1 })
            .limit(6);

            pastEvents = await Event.find({
                ...categoryFilter,
                endDate: { $lt: currentDate },
                status: 'completed'
            })
            .populate('organizer', 'firstName lastName')
            .sort({ startDate: -1 })
            .limit(6);
        }

        const categories = await Event.distinct('category');

        res.render('events/index', {
            title: 'ATCC Events - Tamil Cultural Events & Community Gatherings | Tamil Community Canada',
            description: 'Discover upcoming Tamil cultural events, community gatherings, and networking opportunities across Canada. Join ATCC events celebrating Tamil heritage and building community connections.',
            keywords: 'ATCC events, Tamil cultural events Canada, Tamil community gatherings, Tamil festivals, community events Toronto, Tamil Canadian events',
            url: 'https://atcccanada.org/events',
            ogImage: 'https://atcccanada.org/img/event1.jpeg',
            page: 'events',
            upcomingEvents,
            pastEvents,
            categories,
            selectedCategory: req.query.category || '',
            user: req.user || null
        });
    } catch (error) {
        console.error('Events listing error:', error);
        res.status(500).render('500', {
            title: 'Server Error',
            page: '500',
            user: req.user || null
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'firstName lastName email');

        if (!event) {
            return res.status(404).render('404', {
                title: 'Event Not Found',
                page: '404',
                user: req.user || null
            });
        }

        const relatedEvents = await Event.find({
            _id: { $ne: event._id },
            category: event.category,
            status: { $in: ['upcoming', 'ongoing'] }
        })
        .populate('organizer', 'firstName lastName')
        .sort({ startDate: 1 })
        .limit(3);

        res.render('events/detail', {
            title: `ATCC - ${event.title}`,
            page: 'events',
            event,
            relatedEvents,
            user: req.user || null
        });
    } catch (error) {
        console.error('Event detail error:', error);
        res.status(500).render('500', {
            title: 'Server Error',
            page: '500',
            user: req.user || null
        });
    }
});

router.get('/admin/manage', requireRole(['admin', 'editor']), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        
        let query = {};
        
        if (req.query.status) {
            query.status = req.query.status;
        }

        const events = await Event.find(query)
            .populate('organizer', 'firstName lastName')
            .sort({ startDate: -1 })
            .skip(skip)
            .limit(limit);

        const totalEvents = await Event.countDocuments(query);
        const totalPages = Math.ceil(totalEvents / limit);

        res.render('events/admin', {
            title: 'ATCC - Manage Events',
            page: 'admin',
            events,
            currentPage: page,
            totalPages,
            selectedStatus: req.query.status || '',
            user: req.user
        });
    } catch (error) {
        console.error('Events admin error:', error);
        res.status(500).render('500', {
            title: 'Server Error',
            page: '500',
            user: req.user || null
        });
    }
});

router.get('/admin/new', requireRole(['admin', 'editor']), (req, res) => {
    res.render('events/form', {
        title: 'ATCC - New Event',
        page: 'admin',
        event: null,
        user: req.user,
        error: null
    });
});

router.post('/admin/new', requireRole(['admin', 'editor']), async (req, res) => {
    try {
        const eventData = {
            ...req.body,
            organizer: req.user._id,
            location: {
                address: req.body.address,
                city: req.body.city,
                province: req.body.province,
                postalCode: req.body.postalCode
            },
            tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
        };

        const event = new Event(eventData);
        await event.save();
        
        res.redirect('/events/admin/manage');
    } catch (error) {
        console.error('Event creation error:', error);
        res.render('events/form', {
            title: 'ATCC - New Event',
            page: 'admin',
            event: null,
            user: req.user,
            error: 'An error occurred while creating the event.'
        });
    }
});

router.get('/admin/:id/edit', requireRole(['admin', 'editor']), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).render('404', {
                title: 'Event Not Found',
                page: '404',
                user: req.user
            });
        }

        res.render('events/form', {
            title: 'ATCC - Edit Event',
            page: 'admin',
            event,
            user: req.user,
            error: null
        });
    } catch (error) {
        console.error('Event edit error:', error);
        res.status(500).render('500', {
            title: 'Server Error',
            page: '500',
            user: req.user || null
        });
    }
});

router.post('/admin/:id/edit', requireRole(['admin', 'editor']), async (req, res) => {
    try {
        const eventData = {
            ...req.body,
            location: {
                address: req.body.address,
                city: req.body.city,
                province: req.body.province,
                postalCode: req.body.postalCode
            },
            tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
        };

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            eventData,
            { new: true }
        );

        if (!event) {
            return res.status(404).render('404', {
                title: 'Event Not Found',
                page: '404',
                user: req.user
            });
        }

        res.redirect('/events/admin/manage');
    } catch (error) {
        console.error('Event update error:', error);
        const event = await Event.findById(req.params.id);
        res.render('events/form', {
            title: 'ATCC - Edit Event',
            page: 'admin',
            event,
            user: req.user,
            error: 'An error occurred while updating the event.'
        });
    }
});

router.post('/admin/:id/delete', requireRole(['admin']), async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.redirect('/events/admin/manage');
    } catch (error) {
        console.error('Event deletion error:', error);
        res.redirect('/events/admin/manage');
    }
});

module.exports = router;