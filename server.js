const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Association of Tamil Canadian Community',
        page: 'home'
    });
});

app.get('/about', (req, res) => {
    res.render('about', { 
        title: 'ATCC - About',
        page: 'about'
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', { 
        title: 'ATCC - Contact',
        page: 'contact'
    });
});

app.get('/events', (req, res) => {
    res.render('events', { 
        title: 'ATCC - Events',
        page: 'events'
    });
});

app.get('/causes', (req, res) => {
    res.render('causes', { 
        title: 'ATCC - Causes',
        page: 'causes'
    });
});

app.get('/donate', (req, res) => {
    res.render('donate', { 
        title: 'ATCC - Donate',
        page: 'donate'
    });
});

app.get('/team', (req, res) => {
    res.render('team', { 
        title: 'ATCC - Team',
        page: 'team'
    });
});

app.get('/testimonial', (req, res) => {
    res.render('testimonial', { 
        title: 'ATCC - Testimonial',
        page: 'testimonial'
    });
});

app.get('/specific-event', (req, res) => {
    res.render('specific-event', { 
        title: 'ATCC - Event Details',
        page: 'specific-event'
    });
});

app.get('/404', (req, res) => {
    res.render('404', { 
        title: 'ATCC - Page Not Found',
        page: '404'
    });
});

app.use((req, res) => {
    res.status(404).redirect('/404');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});