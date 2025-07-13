# Association of Tamilnadu Canadian Community (ATCC) Website
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
- **Enhanced Responsive Design**: Comprehensive cross-device optimization (320px to 1920px+)
- **Mobile-First Architecture**: Progressive enhancement with touch-optimized interfaces
- **SEO Optimized**: Meta tags, structured data, sitemap
- **Performance**: Image lazy loading, CSS optimization, smooth scrolling
- **Accessibility**: WCAG compliance, screen reader support, enhanced focus states
- **Security**: Input validation, role-based access control, CSRF protection

## 🛠 Technologies Used

### **Backend**
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **EJS** - Templating engine
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **express-rate-limit** - Rate limiting and DoS protection
- **csrf** - CSRF token protection
- **nodemailer** - Email integration
- **express-validator** - Input validation and sanitization

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

### Railway.app Quick Deploy

For one-click deployment to Railway:

1. **Fork this repository**
2. **Connect to Railway**: Visit [railway.app](https://railway.app) and connect your GitHub
3. **Deploy**: Select the forked repository
4. **Environment Variables**: Add required variables in Railway dashboard
5. **Initial Setup**: Visit `/setup` with `ENABLE_SETUP=true` to configure admin and sample data
6. **Secure**: Remove `ENABLE_SETUP` after setup is complete

## 📁 Project Structure

```
atccwebsite/
├── config/
│   ├── database.js          # MongoDB connection
│   └── email.js             # Email configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── validation.js        # Input validation & sanitization
│   ├── rateLimiting.js      # Rate limiting configurations
│   └── csrf.js              # CSRF token protection
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

### Railway.app Deployment (Recommended)
1. **Connect Repository**: Link your GitHub repo to Railway
2. **Environment Variables**: Set required environment variables in Railway dashboard
3. **Initial Setup**: Visit `/setup` route with `ENABLE_SETUP=true` for first-time configuration
4. **Security**: Remove `ENABLE_SETUP` variable after initial setup
5. **Custom Domain**: Optional - configure custom domain in Railway settings

### Manual Deployment
1. Set environment to production
2. Configure MongoDB Atlas with proper IP whitelisting
3. Set up email service (Gmail with app passwords recommended)
4. Deploy to hosting platform (Railway, Heroku, DigitalOcean, etc.)

### CI/CD Pipeline
- **Security Scanning**: CodeQL v3 with security-extended queries
- **Automated Testing**: Multiple Node.js versions
- **Dependency Updates**: Automated security updates
- **Static Analysis**: Comprehensive security vulnerability detection

## 🔒 Security Features

### **Authentication & Authorization**
- **Password Security**: bcryptjs hashing with salt rounds
- **Role-Based Access**: Admin, Editor, Author, User roles
- **Session Management**: Secure sessions with MongoDB storage
- **Session Security**: HTTPOnly, Secure, SameSite cookie settings

### **Input Validation & Sanitization**
- **XSS Protection**: Escaped template rendering for user content
- **NoSQL Injection Prevention**: ObjectId validation and operator filtering
- **Input Sanitization**: Comprehensive request sanitization middleware
- **MongoDB Protection**: Mongoose ODM with query validation

### **Infrastructure Security**
- **Environment Validation**: Required secrets in production
- **CSRF Protection**: SameSite cookie policy
- **Access Control**: Protected administrative routes
- **Health Monitoring**: Dedicated health check endpoints

### **Rate Limiting & DoS Protection**
- **Authentication Rate Limiting**: 5 login attempts per 15 minutes
- **Admin Operations**: 100 requests per 5 minutes for administrative functions
- **Content Creation**: 10 requests per hour for blog/event/business creation
- **Contact Forms**: 3 submissions per hour to prevent spam
- **General Traffic**: 1000 requests per 15 minutes for normal browsing
- **Brute Force Prevention**: Progressive delays and IP-based tracking

### **Advanced Input Protection**
- **Regex Injection Prevention**: Safe regex creation with character escaping
- **Database Query Security**: Enhanced validation for user-controlled queries
- **Input Length Limits**: Maximum input sizes to prevent buffer attacks
- **Express Validator Integration**: Comprehensive server-side validation
- **Error Handling**: Graceful validation error responses

### **CodeQL Compliance & Security**
- **CSRF Token Protection**: Comprehensive Cross-Site Request Forgery prevention
- **Session Regeneration**: Secure session handling preventing fixation attacks
- **Individual Field Validation**: Eliminated dangerous spread operators and destructuring
- **Type Checking**: Runtime validation ensuring data type integrity
- **HTML Entity Escaping**: Proper output encoding preventing script injection
- **Database Query Hardening**: No user-controlled data flows directly to database
- **Secure Coding Patterns**: Eliminated all vulnerable patterns identified by static analysis

## 📈 Performance Optimizations

- **Image Optimization**: Lazy loading, WebP format
- **CSS/JS Minification**: Optimized assets
- **Database Indexing**: Optimized queries
- **Caching**: Static asset caching
- **SEO**: Meta tags, structured data, sitemap

## 📱 Responsive Design Features

### **Cross-Device Compatibility**
- **Mobile Phones (320px-575px)**: Optimized for small screens with touch-friendly interfaces
- **Tablets Portrait (576px-767px)**: Enhanced readability and navigation for portrait orientation
- **Tablets Landscape (768px-991px)**: Optimized layout for landscape tablet viewing
- **Laptops & Desktops (992px-1199px)**: Standard desktop experience with full feature access
- **Large Screens (1200px+)**: Enhanced spacing and content management for wide displays
- **Ultra-wide Displays (1400px+)**: Optimized layout for ultra-wide monitor setups

### **Mobile-First Architecture**
- **Progressive Enhancement**: Base mobile styles enhanced for larger screens
- **Touch Optimization**: 44px minimum touch targets following accessibility guidelines
- **iOS/Android Support**: Dedicated mobile web app meta tags and optimizations
- **Gesture Support**: Swipe-friendly carousels and navigation elements
- **Viewport Optimization**: Proper scaling and zoom control across all devices

### **Advanced Responsive Features**
- **Dynamic Typography**: Font sizes scale appropriately across all screen sizes
- **Adaptive Navigation**: Collapsible navbar with mobile-optimized menu layout
- **Responsive Tables**: Transform to card-based layout on mobile for better usability
- **Flexible Grid System**: Bootstrap-enhanced grid with custom mobile optimizations
- **Image Responsiveness**: Lazy loading and optimal sizing across all devices

## ♿ Accessibility

- **WCAG 2.1 AA Compliance**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility with enhanced focus states
- **Color Contrast**: High contrast ratios for better readability
- **Alt Text**: All images properly labeled for screen readers
- **Semantic HTML**: Proper heading structure and landmark elements
- **Touch Accessibility**: Large touch targets and gesture-friendly interfaces

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

**Current Version**: v2.1.2 - Enhanced Responsive Design & Cross-Device Optimization

---

**Built with ❤️ by the ATCC development team for the Tamil Canadian community**
