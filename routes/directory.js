const express = require('express');
const Business = require('../models/Business');
const { requireAuth, requireRole } = require('../middleware/auth');
const { validateObjectId, createSafeRegex } = require('../middleware/validation');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;
        
        let query = { isActive: true };
        
        if (req.query.category && req.query.category !== '') {
            query.category = req.query.category;
        }
        
        if (req.query.city && req.query.city !== '') {
            const safeRegex = createSafeRegex(req.query.city);
            if (safeRegex) {
                query['location.city'] = safeRegex;
            }
        }
        
        if (req.query.province && req.query.province !== '') {
            query['location.province'] = req.query.province;
        }
        
        if (req.query.search && req.query.search !== '') {
            query.$text = { $search: req.query.search };
        }

        const businesses = await Business.find(query)
            .sort({ isFeatured: -1, businessName: 1 })
            .skip(skip)
            .limit(limit);

        const totalBusinesses = await Business.countDocuments(query);
        const totalPages = Math.ceil(totalBusinesses / limit);

        const categories = await Business.distinct('category', { isActive: true });
        const cities = await Business.distinct('location.city', { isActive: true });
        const provinces = await Business.distinct('location.province', { isActive: true });

        res.render('directory/index', {
            title: 'ATCC Business Directory - Tamil Canadian Businesses | Association of Tamilnadu Canadian Community',
            description: 'Discover Tamil Canadian businesses across Canada. Find restaurants, services, professionals, and entrepreneurs in our comprehensive business directory with contact information and locations.',
            keywords: 'ATCC business directory, Tamil Canadian businesses, Tamil businesses Canada, Tamil entrepreneurs, Tamil services Canada, Tamil business network',
            url: 'https://atcccanada.org/directory',
            ogImage: 'https://atcccanada.org/img/business-directory.jpg',
            page: 'directory',
            businesses,
            currentPage: page,
            totalPages,
            totalBusinesses,
            categories: categories.sort(),
            cities: cities.sort(),
            provinces: provinces.sort(),
            filters: {
                category: req.query.category || '',
                city: req.query.city || '',
                province: req.query.province || '',
                search: req.query.search || ''
            },
            user: req.user || null
        });
    } catch (error) {
        console.error('Directory listing error:', error);
        res.status(500).render('500', {
            title: 'Server Error',
            page: '500',
            user: req.user || null
        });
    }
});

router.get('/:id', validateObjectId('id'), async (req, res) => {
    try {
        const business = await Business.findOne({ _id: req.params.id, isActive: true });

        if (!business) {
            return res.status(404).render('404', {
                title: 'Business Not Found',
                page: '404',
                user: req.user || null
            });
        }

        const relatedBusinesses = await Business.find({
            _id: { $ne: business._id },
            category: business.category,
            isActive: true
        })
        .sort({ isFeatured: -1, businessName: 1 })
        .limit(4);

        res.render('directory/detail', {
            title: `${business.businessName} - ATCC Business Directory | Tamil Canadian Businesses`,
            description: `${business.businessName} - ${business.description || 'Tamil Canadian business listed in ATCC directory'} Located in ${business.location.city}, ${business.location.province}.`,
            keywords: `${business.businessName}, Tamil business ${business.location.city}, ${business.category.replace('_', ' ')}, ATCC directory`,
            url: `https://atcccanada.org/directory/${business._id}`,
            ogImage: business.logo || 'https://atcccanada.org/img/business-default.jpg',
            page: 'directory',
            business,
            relatedBusinesses,
            user: req.user || null
        });
    } catch (error) {
        console.error('Business detail error:', error);
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
        const limit = 15;
        const skip = (page - 1) * limit;
        
        let query = {};
        
        if (req.query.status) {
            query.isActive = req.query.status === 'active';
        }
        
        if (req.query.category) {
            query.category = req.query.category;
        }

        const businesses = await Business.find(query)
            .populate('addedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBusinesses = await Business.countDocuments(query);
        const totalPages = Math.ceil(totalBusinesses / limit);
        const categories = await Business.distinct('category');

        res.render('directory/admin', {
            title: 'ATCC - Manage Business Directory',
            description: 'Admin panel for managing ATCC business directory listings',
            keywords: 'ATCC admin, business directory management',
            url: 'https://atcccanada.org/directory/admin/manage',
            ogImage: 'https://atcccanada.org/img/admin-panel.jpg',
            page: 'admin',
            businesses,
            currentPage: page,
            totalPages,
            categories: categories.sort(),
            filters: {
                status: req.query.status || '',
                category: req.query.category || ''
            },
            user: req.user
        });
    } catch (error) {
        console.error('Directory admin error:', error);
        res.status(500).render('500', {
            title: 'Server Error',
            page: '500',
            user: req.user || null
        });
    }
});

router.get('/admin/new', requireRole(['admin', 'editor']), (req, res) => {
    res.render('directory/form', {
        title: 'ATCC - Add Business',
        description: 'Add a new business to the ATCC directory',
        keywords: 'ATCC add business, business directory',
        url: 'https://atcccanada.org/directory/admin/new',
        ogImage: 'https://atcccanada.org/img/admin-panel.jpg',
        page: 'admin',
        business: null,
        user: req.user,
        error: null
    });
});

router.post('/admin/new', requireRole(['admin', 'editor']), async (req, res) => {
    try {
        const businessData = {
            ...req.body,
            ownerName: {
                firstName: req.body.ownerFirstName,
                lastName: req.body.ownerLastName
            },
            contactInfo: {
                phone: req.body.phone,
                email: req.body.email,
                website: req.body.website
            },
            location: {
                address: req.body.address,
                city: req.body.city,
                province: req.body.province,
                postalCode: req.body.postalCode
            },
            services: req.body.services ? req.body.services.split(',').map(s => s.trim()) : [],
            socialMedia: {
                facebook: req.body.facebook,
                instagram: req.body.instagram,
                twitter: req.body.twitter,
                linkedin: req.body.linkedin
            },
            addedBy: req.user._id
        };

        const business = new Business(businessData);
        await business.save();
        
        res.redirect('/directory/admin/manage');
    } catch (error) {
        console.error('Business creation error:', error);
        res.render('directory/form', {
            title: 'ATCC - Add Business',
            description: 'Add a new business to the ATCC directory',
            keywords: 'ATCC add business, business directory',
            url: 'https://atcccanada.org/directory/admin/new',
            ogImage: 'https://atcccanada.org/img/admin-panel.jpg',
            page: 'admin',
            business: null,
            user: req.user,
            error: 'An error occurred while adding the business.'
        });
    }
});

router.get('/admin/:id/edit', requireRole(['admin', 'editor']), async (req, res) => {
    try {
        const business = await Business.findById(req.params.id);
        
        if (!business) {
            return res.status(404).render('404', {
                title: 'Business Not Found',
                page: '404',
                user: req.user
            });
        }

        res.render('directory/form', {
            title: 'ATCC - Edit Business',
            description: 'Edit business information in the ATCC directory',
            keywords: 'ATCC edit business, business directory',
            url: `https://atcccanada.org/directory/admin/${business._id}/edit`,
            ogImage: 'https://atcccanada.org/img/admin-panel.jpg',
            page: 'admin',
            business,
            user: req.user,
            error: null
        });
    } catch (error) {
        console.error('Business edit error:', error);
        res.status(500).render('500', {
            title: 'Server Error',
            page: '500',
            user: req.user || null
        });
    }
});

router.post('/admin/:id/edit', requireRole(['admin', 'editor']), async (req, res) => {
    try {
        // Explicitly extract and validate fields to prevent injection
        const businessName = req.body.businessName;
        const description = req.body.description;
        const category = req.body.category;
        const ownerFirstName = req.body.ownerFirstName;
        const ownerLastName = req.body.ownerLastName;
        const phone = req.body.phone;
        const email = req.body.email;
        const website = req.body.website;
        const address = req.body.address;
        const city = req.body.city;
        const province = req.body.province;
        const postalCode = req.body.postalCode;
        const services = req.body.services;
        const facebook = req.body.facebook;
        const instagram = req.body.instagram;
        const twitter = req.body.twitter;
        const linkedin = req.body.linkedin;
        
        // Type validation
        if (typeof businessName !== 'string' || typeof description !== 'string') {
            return res.status(400).redirect('/directory/admin/manage');
        }
        
        // Use $set operator with explicit field updates for security
        const business = await Business.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    businessName: businessName,
                    description: description,
                    category: category,
                    'ownerName.firstName': ownerFirstName,
                    'ownerName.lastName': ownerLastName,
                    'contactInfo.phone': phone,
                    'contactInfo.email': email,
                    'contactInfo.website': website,
                    'location.address': address,
                    'location.city': city,
                    'location.province': province,
                    'location.postalCode': postalCode,
                    services: services ? services.split(',').map(s => s.trim()) : [],
                    'socialMedia.facebook': facebook,
                    'socialMedia.instagram': instagram,
                    'socialMedia.twitter': twitter,
                    'socialMedia.linkedin': linkedin
                }
            },
            { new: true }
        );

        if (!business) {
            return res.status(404).render('404', {
                title: 'Business Not Found',
                page: '404',
                user: req.user
            });
        }

        res.redirect('/directory/admin/manage');
    } catch (error) {
        console.error('Business update error:', error);
        const business = await Business.findById(req.params.id);
        res.render('directory/form', {
            title: 'ATCC - Edit Business',
            description: 'Edit business information in the ATCC directory',
            keywords: 'ATCC edit business, business directory',
            url: `https://atcccanada.org/directory/admin/${business._id}/edit`,
            ogImage: 'https://atcccanada.org/img/admin-panel.jpg',
            page: 'admin',
            business,
            user: req.user,
            error: 'An error occurred while updating the business.'
        });
    }
});

router.post('/admin/:id/toggle-status', requireRole(['admin']), async (req, res) => {
    try {
        const business = await Business.findById(req.params.id);
        if (business) {
            business.isActive = !business.isActive;
            await business.save();
        }
        res.redirect('/directory/admin/manage');
    } catch (error) {
        console.error('Business status toggle error:', error);
        res.redirect('/directory/admin/manage');
    }
});

router.post('/admin/:id/delete', requireRole(['admin']), async (req, res) => {
    try {
        await Business.findByIdAndDelete(req.params.id);
        res.redirect('/directory/admin/manage');
    } catch (error) {
        console.error('Business deletion error:', error);
        res.redirect('/directory/admin/manage');
    }
});

module.exports = router;