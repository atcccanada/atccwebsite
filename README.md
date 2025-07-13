# Association of Tamilnadu Canadian Community (ATCC) Website

[![Node.js CI](https://github.com/atcccanada/atccwebsite/workflows/CI/badge.svg)](https://github.com/atcccanada/atccwebsite/actions)
[![Security](https://github.com/atcccanada/atccwebsite/workflows/CodeQL/badge.svg)](https://github.com/atcccanada/atccwebsite/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview

The official website for the **Association of Tamilnadu Canadian Community (ATCC)**, a nonprofit organization founded in May 2023, dedicated to uniting and empowering the Tamil community across Canada. This comprehensive web application serves as the digital hub for 140+ volunteers, 5,000+ community members, and 13 specialized teams.

## ✨ Key Features

### 🏠 **Core Pages & Functionality**
- **Home Page**: Dynamic banner slider with community highlights
- **About Us**: Complete team structure, mission, and partnership information  
- **Events System**: Full event management with upcoming/past events
- **Blog Platform**: Complete CMS with search, categories, and admin panel
- **Business Directory**: Comprehensive table format with filtering capabilities
- **Contact & Volunteer Registration**: Integrated forms with email notifications
- **Membership**: Detailed pricing tiers and benefits

### 🔐 **Admin & Content Management**
- **Role-based Authentication**: Admin, Editor, Author, User roles
- **Admin Dashboard**: Complete CRUD operations for all content
- **User Management**: Role assignment and account administration
- **Content Management**: Blogs, events, business directory management
- **Email Integration**: Automated notifications via Nodemailer

### 🎨 **Technical Excellence**
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **SEO Optimized**: Meta tags, structured data, sitemap
- **Performance**: Image lazy loading, CSS optimization
- **Accessibility**: WCAG compliance, screen reader support
- **Security**: Input validation, role-based access control

## 🛠 Technologies Used

### **Backend**
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **EJS** - Templating engine
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **nodemailer** - Email integration
- **express-validator** - Input validation

### **Frontend**
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icons
- **jQuery** - JavaScript library
- **Owl Carousel** - Image carousels
- **Animate.css** - Animations
- **WOW.js** - Scroll animations

### **Development Tools**
- **Nodemon** - Development server
- **MongoDB Atlas** - Cloud database
- **GitHub Actions** - CI/CD pipeline

## 🚀 Quick Start

### Prerequisites
- Node.js (v16.x or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/atcccanada/atccwebsite.git
   cd atccwebsite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Create admin user:**
   ```bash
   node scripts/create-admin.js
   ```

6. **Add sample data:**
   ```bash
   node scripts/add-sample-businesses.js
   ```

7. **Open browser:** `http://localhost:3000`

## 📁 Project Structure

```
atccwebsite/
├── config/
│   ├── database.js          # MongoDB connection
│   └── email.js             # Email configuration
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── User.js              # User model with roles
│   ├── Blog.js              # Blog posts
│   ├── Event.js             # Events management
│   └── Business.js          # Business directory
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── admin.js             # Admin dashboard
│   ├── blog.js              # Blog management
│   ├── events.js            # Events management
│   ├── directory.js         # Business directory
│   ├── contact.js           # Contact & volunteer forms
│   └── users.js             # User management
├── views/
│   ├── partials/            # Reusable components
│   ├── admin/               # Admin panel views
│   ├── auth/                # Login/register
│   ├── blog/                # Blog views
│   ├── events/              # Event views
│   └── directory/           # Business directory views
├── public/
│   ├── css/                 # Stylesheets
│   ├── js/                  # Client-side scripts
│   ├── img/                 # Images
│   └── lib/                 # Third-party libraries
├── scripts/                 # Utility scripts
└── server.js                # Main application file
```

## 🎯 Available Scripts

- `npm start` - Production server
- `npm run dev` - Development server with auto-reload
- `npm test` - Run tests
- `npm run lint` - Code linting
- `npm run build` - Build application

## 🌐 Routes & Features

### **Public Routes**
- `GET /` - Home page
- `GET /about` - About ATCC
- `GET /events` - Events listing
- `GET /blog` - Blog posts
- `GET /directory` - Business directory
- `GET /contact` - Contact & volunteer registration
- `GET /membership` - Membership information

### **Authentication**
- `GET /auth/login` - User login
- `GET /auth/register` - User registration
- `POST /auth/logout` - User logout

### **Admin Panel** (Role-based access)
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/blogs` - Blog management
- `GET /admin/users` - User management
- `GET /events/admin/manage` - Event management
- `GET /directory/admin/manage` - Business directory management

## 👥 User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, user management, all content |
| **Editor** | Content management (blogs, events, directory) |
| **Author** | Create/edit own blog posts |
| **User** | View content, basic access |

## 🔧 Configuration

### Environment Variables (.env)
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/atcc-website

# Session
SESSION_SECRET=your-secret-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="ATCC Website" <noreply@atcccanada.ca>
```

## 🚀 Deployment

### Production Setup
1. Set environment to production
2. Configure MongoDB Atlas
3. Set up email service
4. Deploy to hosting platform (Heroku, DigitalOcean, etc.)

### CI/CD Pipeline
- Automated testing on multiple Node.js versions
- Security scanning with CodeQL
- Automated dependency updates
- Production deployment ready

## 🔒 Security Features

- **Authentication**: bcryptjs password hashing
- **Authorization**: Role-based access control
- **Input Validation**: express-validator sanitization
- **Session Management**: Secure session handling
- **CSRF Protection**: Built-in protection
- **SQL Injection Prevention**: MongoDB ODM protection

## 📈 Performance Optimizations

- **Image Optimization**: Lazy loading, WebP format
- **CSS/JS Minification**: Optimized assets
- **Database Indexing**: Optimized queries
- **Caching**: Static asset caching
- **SEO**: Meta tags, structured data, sitemap

## ♿ Accessibility

- **WCAG 2.1 AA Compliance**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: High contrast ratios
- **Alt Text**: All images properly labeled
- **Semantic HTML**: Proper heading structure

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

### Development Workflow
1. Check latest main: `git checkout main && git pull origin main`
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test: `npm run dev`
4. Commit: `git add . && git commit -m "Description"`
5. Push: `git push origin feature-name`
6. Create Pull Request on GitHub

## 📞 Contact & Support

- **Email**: info@atcccanada.ca
- **Instagram**: [@atcc.ca](https://www.instagram.com/atcc.ca/)
- **Facebook**: [ATCC Canada](https://www.facebook.com/atccc.ca/)
- **LinkedIn**: [ATCC Company Page](https://www.linkedin.com/company/94783062)
- **YouTube**: [ATCC Channel](https://www.youtube.com/channel/UCaZ2zNvfGFVKMgAcF9bFpPw)

## 🙏 Acknowledgments

- **Template Base**: ChariTeam - Free Nonprofit Website Template by [HTML Codex](https://htmlcodex.com/)
- **Icons**: [Font Awesome](https://fontawesome.com/)
- **UI Framework**: [Bootstrap](https://getbootstrap.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Hosting**: [Your Hosting Provider]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.

## 🔖 Version

**Current Version**: v2.0.0 - Complete CMS Implementation

---

**Built with ❤️ by the ATCC development team for the Tamil Canadian community**