const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/database');
const { checkAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'atcc-website-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/atcc-website'
    }),
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

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

app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'ATCC - Page Not Found',
        page: '404',
        user: req.user || null
    });
});

const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});