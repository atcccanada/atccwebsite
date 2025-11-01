# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ATCC Website** - A comprehensive Node.js/Express web application for the Association of Tamilnadu Canadian Community (ATCC). This is a full-featured CMS with authentication, role-based access control, content management (blogs, events, business directory), and email integration.

- **Tech Stack**: Node.js + Express, MongoDB, EJS templating, Bootstrap 5 frontend
- **Key Features**: Admin dashboard, role-based content management, event management, business directory, contact forms, volunteer registration
- **Deployment**: Railway.app recommended (configured with health checks, proxy trust, environment validation)

## Common Development Commands

### Running the Application
- **Development**: `npm run dev` - Runs with nodemon for auto-reload on file changes
- **Production**: `npm start` - Runs the server directly
- **Test**: `npm test` - Runs CI tests (syntax validation, module loading, package.json validation)
- **Lint**: `npm run lint` - Validates syntax of core files (server.js, middleware files)

### Database Setup
- **Create admin user**: `node scripts/create-admin.js`
- **Add sample data**: `node scripts/add-sample-businesses.js`
- **Initial setup on new deployment**: Visit `/setup` with `ENABLE_SETUP=true` in environment variables

### Development Workflow
1. Copy `.env.example` to `.env` and configure:
   - MongoDB URI (local or Atlas)
   - SESSION_SECRET (generate random string for production)
   - SMTP settings for email (Gmail app passwords recommended)
   - SITE_URL for production deployments
2. Run `npm install`
3. Create admin user with setup script or `/setup` endpoint
4. Run `npm run dev`
5. Access at `http://localhost:3000`

## Architecture & Code Structure

### Application Flow
1. **Entry Point** ([server.js](server.js)): Express app initialization, middleware setup, route mounting
2. **Middleware Stack** (applied globally in order):
   - Rate limiting ([middleware/rateLimiting.js](middleware/rateLimiting.js))
   - Input sanitization ([middleware/validation.js](middleware/validation.js))
   - CSRF protection ([middleware/csrf.js](middleware/csrf.js))
   - Authentication check ([middleware/auth.js](middleware/auth.js))
3. **Database**: MongoDB via Mongoose ([config/database.js](config/database.js))
4. **Email**: Nodemailer SMTP ([config/email.js](config/email.js))

### Request Flow Example
User request → Rate limiting check → Input sanitization → CSRF token validation → Auth check → Route handler → Response

### Directory Structure

**Core Application**
- [routes/](routes/) - Express route handlers (auth, blog, admin, events, directory, contact)
- [models/](models/) - Mongoose schemas (User, Blog, Event, Business)
- [middleware/](middleware/) - Custom middleware for auth, validation, rate limiting, CSRF
- [config/](config/) - Database and email configuration
- [views/](views/) - EJS templates (partials, admin panel, public pages)
- [public/](public/) - Static assets (CSS, JS, images)
- [scripts/](scripts/) - Utility scripts for initial setup

**Key Routes** ([routes/](routes/))
- `auth.js` - Login, register, logout (with registration validation)
- `admin.js` - Admin dashboard, user management, content CRUD
- `blog.js` - Blog post CRUD operations
- `events.js` - Event management
- `directory.js` - Business directory management
- `contact.js` - Contact form and volunteer registration

### Data Models ([models/](models/))
- **User.js**: Username, email, password (hashed), role (admin/editor/author/user), timestamps
- **Blog.js**: Title, content, author reference, slug, visibility, timestamps
- **Event.js**: Name, description, date/time, location, category
- **Business.js**: Company name, contact, services, location, website, featured status

### Security Architecture

**Authentication & Authorization**
- Session-based auth with MongoDB session store ([middleware/auth.js](middleware/auth.js))
- Password hashing with bcryptjs (configured in User model)
- Role-based access control: Admin > Editor > Author > User
- Protected routes check user role before allowing access

**Input Protection** ([middleware/validation.js](middleware/validation.js))
- Request sanitization applied globally
- Escaping in EJS templates prevents XSS
- express-validator for explicit validation on sensitive routes
- Regex injection prevention with character escaping
- Input length limits to prevent buffer attacks

**Rate Limiting** ([middleware/rateLimiting.js](middleware/rateLimiting.js))
- Auth endpoints: 5 attempts per 15 minutes
- Admin operations: 100 requests per 5 minutes
- Content creation: 10 requests per hour
- Contact forms: 3 submissions per hour
- General traffic: 1000 requests per 15 minutes
- Configured to work behind proxies (Railway, Heroku) with `trust proxy`

**CSRF Protection** ([middleware/csrf.js](middleware/csrf.js))
- CSRF tokens on all forms
- SameSite=strict cookies
- Token validation on state-changing requests (POST, PUT, DELETE)

### Environment & Deployment

**Environment Variables** (.env)
- `PORT` (default 3000)
- `NODE_ENV` (development/production)
- `MONGODB_URI` (MongoDB connection string)
- `SESSION_SECRET` (required in production - set random value)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` (email config)
- `ADMIN_EMAIL` (for notifications)
- `SITE_URL` (public URL for production)
- `ENABLE_SETUP` (set to 'true' only for initial setup, then remove)

**Railway Deployment**
- Health check endpoint: `GET /health` (returns JSON status)
- Proxy trust configured: `app.set('trust proxy', 1)` in production
- Environment validation: SESSION_SECRET required in production
- One-click deploy from GitHub enabled

## Common Development Patterns

### Adding a New Page
1. Create route handler in appropriate [routes/](routes/) file
2. Create EJS template in [views/](views/)
3. Mount route in [server.js](server.js) at appropriate path
4. Pass metadata (title, description, SEO tags) to template

### Adding a New Model
1. Create schema file in [models/](models/)
2. Export Mongoose model
3. Import in routes as needed
4. Add routes for CRUD operations

### Adding Protected Admin Route
1. Create route handler in [routes/admin.js](routes/admin.js) or relevant file
2. Use middleware: `const { requireAuth, requireRole } = require('../middleware/auth');`
3. Apply: `router.post('/admin/path', requireAuth, requireRole(['admin', 'editor']), handler)`
4. Validate input with express-validator

### Sending Emails
1. Import: `const { sendEmail } = require('../config/email');`
2. Call: `sendEmail(to, subject, htmlContent)`
3. Email templates in config/email.js

## Important Notes

### Security Considerations
- Never commit `.env` file (already in .gitignore)
- Rotate SESSION_SECRET in production regularly
- Use app passwords for Gmail, not actual password
- All user input is sanitized globally - still validate on sensitive operations
- ENABLE_SETUP must be removed/disabled in production

### Testing
- `npm test` validates module loading and syntax
- No Jest/Mocha tests currently - CI relies on CodeQL and syntax validation
- Test critical paths manually before deployment
- GitHub Actions runs CodeQL security scanning on push

### Common Issues
- **Rate limiting errors**: Check X-Forwarded-For headers in production (proxy trust configured)
- **Email failures**: Verify SMTP credentials and Gmail app password setup
- **Session issues**: Ensure MONGODB_URI and SESSION_SECRET are set
- **CSRF errors**: Ensure forms include CSRF token from view context

### Performance
- Images should be lazy-loaded (already implemented in views)
- Database queries should use appropriate indexes
- Static assets are served with Express.static
- Consider caching for frequently accessed data

## Related Documentation
- Main README: [README.md](README.md)
- Change log: [CHANGELOG.md](CHANGELOG.md)
- Tasks/Issues: [TASKS.md](TASKS.md)
- Environment template: [.env.example](.env.example)
