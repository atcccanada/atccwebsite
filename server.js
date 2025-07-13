const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/database');
const { checkAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

// Connect to database
connectDB().catch(console.error);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Trust proxy for accurate rate limiting in cloud deployments
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // Trust first proxy (Railway, Heroku, etc.)
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Health check route for Railway
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Validate required environment variables in production
if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
    console.error('❌ SESSION_SECRET environment variable is required in production');
    process.exit(1);
}

app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/atcc-website'
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'strict' // CSRF protection
    }
}));

// Import validation, rate limiting, and CSRF middleware
const { sanitizeRequest } = require('./middleware/validation');
const { generalLimiter } = require('./middleware/rateLimiting');
const { conditionalCSRF } = require('./middleware/csrf');

// Apply rate limiting to all requests
app.use(generalLimiter);

// Apply input sanitization to all requests
app.use(sanitizeRequest);

// Apply CSRF protection
app.use(conditionalCSRF);

app.use(checkAuth);

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin');
const eventsRoutes = require('./routes/events');
const directoryRoutes = require('./routes/directory');
const contactRoutes = require('./routes/contact');

app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);
app.use('/admin', adminRoutes);
app.use('/events', eventsRoutes);
app.use('/directory', directoryRoutes);
app.use('/contact', contactRoutes);

app.get('/', (req, res) => {
    res.render('index', { 
        title: 'ATCC - Building Unity Across Canada | Association of Tamilnadu Canadian Community',
        description: 'Join the Association of Tamilnadu Canadian Community (ATCC) - Building unity across Canada with 140+ volunteers, cultural events, networking opportunities, and community support for Tamil Canadians.',
        keywords: 'Tamil Canadian community, ATCC, Tamil culture Canada, Tamil events, Tamil networking, Canadian Tamil association, Tamil volunteers, Tamil heritage Canada',
        url: 'https://atcccanada.org/',
        ogImage: 'https://atcccanada.org/img/DSC_6688-banner.jpeg',
        page: 'home',
        user: req.user || null
    });
});

app.get('/about', (req, res) => {
    res.render('about', { 
        title: 'About ATCC - Mission, Vision & Team | Tamil Community Canada',
        description: 'Learn about ATCC\'s mission to build a connected Tamil community in Canada. Meet our leadership team including President Rizwana, VP Paveen Raj, and our 140+ dedicated volunteers.',
        keywords: 'ATCC about, Tamil community mission, ATCC leadership team, Rizwana ATCC president, Paveen Raj ATCC, Tamil Canadian organization',
        url: 'https://atcccanada.org/about',
        ogImage: 'https://atcccanada.org/img/team-photo.jpg',
        page: 'about',
        user: req.user || null
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', { 
        title: 'Contact ATCC - Get In Touch & Volunteer Registration | Tamil Community Canada',
        description: 'Contact the Association of Tamil Community in Canada (ATCC). Send us a message, register as a volunteer, or connect with our team to get involved in the Tamil Canadian community.',
        keywords: 'contact ATCC, ATCC volunteer registration, Tamil community contact, get involved ATCC, Tamil Canadian organization contact',
        url: 'https://atcccanada.org/contact',
        ogImage: 'https://atcccanada.org/img/contact-banner.jpg',
        page: 'contact',
        user: req.user || null,
        errors: [],
        formData: {},
        success: false,
        volunteerErrors: [],
        volunteerFormData: {},
        volunteerSuccess: false
    });
});


app.get('/causes', (req, res) => {
    res.render('causes', { 
        title: 'ATCC - Causes',
        page: 'causes',
        user: req.user || null
    });
});

app.get('/donate', (req, res) => {
    res.render('donate', { 
        title: 'ATCC - Donate',
        page: 'donate',
        user: req.user || null
    });
});

app.get('/team', (req, res) => {
    res.render('team', { 
        title: 'ATCC - Team',
        page: 'team',
        user: req.user || null
    });
});

app.get('/testimonial', (req, res) => {
    res.render('testimonial', { 
        title: 'ATCC - Testimonial',
        page: 'testimonial',
        user: req.user || null
    });
});

app.get('/membership', (req, res) => {
    res.render('membership', { 
        title: 'Join ATCC Membership - Individual, Family & Student Plans | Tamil Community',
        description: 'Become an ATCC member and join 5,000+ Tamil Canadians. Choose from Individual ($25), Family ($40), or Student ($15) memberships with exclusive benefits and networking opportunities.',
        keywords: 'ATCC membership, Tamil community membership, join ATCC, Tamil Canadian membership benefits, ATCC member benefits',
        url: 'https://atcccanada.org/membership',
        ogImage: 'https://atcccanada.org/img/membership-benefits.jpg',
        page: 'membership',
        user: req.user || null
    });
});

app.get('/specific-event', (req, res) => {
    res.render('specific-event', { 
        title: 'ATCC - Event Details',
        page: 'specific-event',
        user: req.user || null
    });
});

app.get('/404', (req, res) => {
    res.render('404', { 
        title: 'ATCC - Page Not Found',
        page: '404',
        user: req.user || null
    });
});

// Setup routes for initial deployment (remove after setup)
// Only available in development or when ENABLE_SETUP=true
app.get('/setup', async (_req, res) => {
    // Security check - only allow in development or when explicitly enabled
    if (process.env.NODE_ENV === 'production' && process.env.ENABLE_SETUP !== 'true') {
        return res.status(404).render('404', { 
            title: 'ATCC - Page Not Found',
            page: '404',
            user: null
        });
    }
    try {
        const User = require('./models/User');
        const Business = require('./models/Business');
        
        let results = [];
        
        // 1. Create Admin User
        try {
            const existingAdmin = await User.findOne({ role: 'admin' });
            if (!existingAdmin) {
                const adminData = {
                    username: 'admin',
                    email: 'admin@atcccanada.ca',
                    password: 'admin123', // CHANGE THIS!
                    firstName: 'Admin',
                    lastName: 'User',
                    role: 'admin',
                    isActive: true
                };
                
                const admin = new User(adminData);
                await admin.save();
                results.push('✅ Admin user created successfully!');
                results.push('📧 Email: admin@atcccanada.ca');
                results.push('🔑 Password: admin123 (CHANGE THIS!)');
            } else {
                results.push('ℹ️ Admin user already exists: ' + existingAdmin.email);
            }
        } catch (error) {
            results.push('❌ Error creating admin: ' + error.message);
        }
        
        // 2. Add Sample Businesses
        try {
            const sampleBusinesses = [
                {
                    businessName: "Tamil Spice Restaurant",
                    ownerName: { firstName: "Raj", lastName: "Kumar" },
                    contactInfo: {
                        phone: "(416) 555-0123",
                        email: "info@tamilspice.ca",
                        website: "https://tamilspice.ca"
                    },
                    location: {
                        address: "123 Main Street",
                        city: "Toronto",
                        province: "Ontario",
                        postalCode: "M5V 3A8"
                    },
                    category: "restaurant",
                    description: "Authentic Tamil cuisine serving traditional dishes from Tamil Nadu",
                    services: ["Dine-in", "Takeout", "Catering", "Special Events"]
                },
                {
                    businessName: "TechTamil Solutions",
                    ownerName: { firstName: "Priya", lastName: "Sharma" },
                    contactInfo: {
                        phone: "(604) 555-0456",
                        email: "contact@techtamil.ca",
                        website: "https://techtamil.ca"
                    },
                    location: {
                        address: "456 Technology Drive",
                        city: "Vancouver",
                        province: "British Columbia",
                        postalCode: "V6B 1A1"
                    },
                    category: "technology",
                    description: "IT consulting and software development services",
                    services: ["Web Development", "Mobile Apps", "IT Consulting", "Cloud Solutions"]
                },
                {
                    businessName: "Tamil Medical Clinic",
                    ownerName: { firstName: "Dr. Arun", lastName: "Patel" },
                    contactInfo: {
                        phone: "(403) 555-0789",
                        email: "clinic@tamilmedical.ca"
                    },
                    location: {
                        address: "789 Health Avenue",
                        city: "Calgary",
                        province: "Alberta",
                        postalCode: "T2P 1J9"
                    },
                    category: "healthcare",
                    description: "Comprehensive healthcare services with Tamil-speaking staff",
                    services: ["Family Medicine", "Pediatrics", "Preventive Care", "Health Screenings"]
                }
            ];
            
            let businessCount = 0;
            for (const businessData of sampleBusinesses) {
                const existingBusiness = await Business.findOne({ 
                    businessName: businessData.businessName 
                });
                
                if (!existingBusiness) {
                    const business = new Business(businessData);
                    await business.save();
                    businessCount++;
                }
            }
            
            if (businessCount > 0) {
                results.push(`✅ Added ${businessCount} sample businesses`);
            } else {
                results.push('ℹ️ Sample businesses already exist');
            }
        } catch (error) {
            results.push('❌ Error adding businesses: ' + error.message);
        }
        
        // Generate HTML response
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>ATCC Setup Complete</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
                .result { margin: 10px 0; padding: 10px; border-radius: 5px; }
                .success { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
                .info { background-color: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; }
                .error { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
                .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; }
            </style>
        </head>
        <body>
            <h1>🚀 ATCC Setup Complete!</h1>
            <div>
                ${results.map(result => {
                    let className = 'info';
                    if (result.includes('✅')) className = 'success';
                    if (result.includes('❌')) className = 'error';
                    if (result.includes('🔑')) className = 'warning';
                    return `<div class="result ${className}">${result}</div>`;
                }).join('')}
            </div>
            
            <h2>🔐 Next Steps:</h2>
            <ol>
                <li>Login at <a href="/auth/login">/auth/login</a> with admin credentials</li>
                <li><strong>Change the admin password immediately!</strong></li>
                <li>Visit <a href="/admin/dashboard">Admin Dashboard</a> to manage content</li>
                <li>Check <a href="/directory">Business Directory</a> for sample data</li>
                <li><strong>Remove this setup route from server.js after setup!</strong></li>
            </ol>
            
            <h2>🌐 Available Pages:</h2>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/events">Events</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/directory">Business Directory</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/membership">Membership</a></li>
            </ul>
        </body>
        </html>`;
        
        res.send(html);
        
    } catch (error) {
        res.status(500).send(`
            <h1>Setup Error</h1>
            <p style="color: red;">Error: ${error.message}</p>
            <p>Please check your MongoDB connection and try again.</p>
        `);
    }
});

// Promote user to admin route
app.get('/setup/promote/:email', async (req, res) => {
    // Security check - only allow in development or when explicitly enabled
    if (process.env.NODE_ENV === 'production' && process.env.ENABLE_SETUP !== 'true') {
        return res.status(404).render('404', { 
            title: 'ATCC - Page Not Found',
            page: '404',
            user: null
        });
    }
    try {
        const User = require('./models/User');
        const email = req.params.email;
        
        const user = await User.findOne({ email: email });
        if (!user) {
            // Properly escape email to prevent XSS
            const safeEmail = email.replace(/[<>&"']/g, (match) => {
                const escapes = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#x27;' };
                return escapes[match];
            });
            return res.send(`<h1>User Not Found</h1><p>No user found with email: ${safeEmail}</p>`);
        }
        
        user.role = 'admin';
        user.isActive = true;
        await user.save();
        
        res.send(`
            <h1>✅ User Promoted!</h1>
            <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><a href="/setup">← Back to Setup</a></p>
        `);
        
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><p>${error.message}</p>`);
    }
});

app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'ATCC - Page Not Found',
        page: '404',
        user: req.user || null
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});