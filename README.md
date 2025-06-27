# Association of Tamil Canadian Community (ATCC) Website

## Overview

The official website for the Association of Tamil Canadian Community (ATCC), a non-profit organization dedicated to serving the Tamil community in Canada. This modern web application serves as a digital hub for community members to stay informed about events, initiatives, and resources.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern Architecture**: Built with Node.js, Express, and EJS templating
- **Dynamic Content**: Server-side rendering with EJS templates
- **Modern UI/UX**: Clean and intuitive user interface with smooth animations
- **Multiple Pages**:
  - Home: Overview and highlights
  - About: Information about ATCC and its mission
  - Events: Upcoming community events and activities
  - Causes: Community initiatives and programs
  - Team: Meet the team behind ATCC
  - Testimonials: Community member testimonials
  - Donate: Support our community initiatives
  - Contact: Get in touch with us

## Technologies Used

- **Backend**:
  - Node.js
  - Express.js
  - EJS (Embedded JavaScript Templates)

- **Frontend**:
  - HTML5, CSS3, JavaScript
  - Bootstrap 5
  - Font Awesome Icons
  - jQuery
  - Owl Carousel
  - Animate.css
  - WOW.js (animations)

- **Development Tools**:
  - Nodemon (development server)
  - npm (package management)

## Getting Started

### Prerequisites

- Node.js (version 16.x or higher)
- npm (comes with Node.js)
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd atccwebsite
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

### Production

To run in production mode:

```bash
npm start
```

## Project Structure

```
atccwebsite/
├── .github/
│   └── workflows/        # GitHub Actions CI/CD workflows
├── public/               # Static assets
│   ├── css/             # Compiled CSS files
│   ├── img/             # Image assets
│   ├── js/              # JavaScript files
│   ├── lib/             # Third-party libraries
│   └── scss/            # SASS source files
├── views/               # EJS templates
│   ├── partials/        # Reusable template parts
│   │   ├── header.ejs   # HTML head section
│   │   ├── navbar.ejs   # Navigation bar
│   │   └── footer.ejs   # Footer and scripts
│   ├── index.ejs        # Home page
│   ├── about.ejs        # About page
│   ├── contact.ejs      # Contact page
│   ├── events.ejs       # Events page
│   ├── causes.ejs       # Causes page
│   ├── donate.ejs       # Donation page
│   ├── team.ejs         # Team page
│   ├── testimonial.ejs  # Testimonials page
│   ├── specific-event.ejs # Event details page
│   └── 404.ejs          # Error page
├── server.js            # Express server configuration
├── package.json         # Node.js dependencies and scripts
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload
- `npm test` - Run tests (placeholder for future implementation)
- `npm run lint` - Run linting (placeholder for future implementation)
- `npm run build` - Build the application (placeholder for future implementation)

## Routes

- `GET /` - Home page
- `GET /about` - About ATCC
- `GET /contact` - Contact information and form
- `GET /events` - Events listing
- `GET /causes` - Community causes and initiatives
- `GET /donate` - Support and donation page
- `GET /team` - Team members
- `GET /testimonial` - Community testimonials
- `GET /specific-event` - Individual event details
- `GET /404` - Error page

## CI/CD Pipeline

This project includes comprehensive GitHub Actions workflows:

### 🔄 Continuous Integration (`ci.yml`)

- **Multi-Node Testing**: Tests on Node.js 16.x, 18.x, and 20.x
- **Security Auditing**: npm audit for vulnerability detection
- **Automated Deployment**: Ready for production deployment
- **Triggers**: Push to main/develop, Pull Requests

### 🔒 Security Analysis (`codeql.yml`)

- **CodeQL Scanning**: Automated security vulnerability detection
- **Weekly Schedule**: Runs every Monday
- **JavaScript Analysis**: Comprehensive code security review

### 📦 Dependency Management (`dependency-update.yml`)

- **Automated Updates**: Weekly dependency updates
- **Pull Request Creation**: Automatic PRs for dependency updates
- **Testing Integration**: Runs tests before creating PRs

## Development Workflow

1. **Fork and Clone**: Fork the repository and clone to your local machine
2. **Branch**: Create a feature branch (`git checkout -b feature/amazing-feature`)
3. **Develop**: Make your changes and test locally with `npm run dev`
4. **Test**: Ensure all functionality works correctly
5. **Commit**: Commit your changes with descriptive messages
6. **Push**: Push to your forked repository
7. **Pull Request**: Create a PR to the main repository

## Directions to Developers (Git command reference)

The following steps shows how to:

- Create a feature branch from `main`
- Add and commit changes
- Push to GitHub
- Open a Pull Request (PR)
- Merge it back to `main`

---

## ✅ 1. Checkout Latest `main`

```bash
git checkout main
git pull origin main
```

---

## ✅ 2. Create a New Feature Branch

```bash
git checkout -b feature-branch
```

Replace `feature-branch` with a descriptive name (e.g., `fix-login-error`, `add-user-api`).

---

## ✅ 3. Add or Modify Files

Create or change your files, then:

```bash
git add .
git commit -m "Describe what you did"
```

---

## ✅ 4. Push Your Feature Branch

```bash
git push origin feature-branch
```

---

## ✅ 5. Create a Pull Request (PR)

Go to your GitHub repo:

- Click **"Compare & pull request"**
- Base branch: `main`
- Compare branch: `feature-branch`
- Add title and description
- Click **"Create pull request"**

---

## ✅ 6. Merge the Pull Request

Once approved:

```bash
git checkout main
git pull origin main
git merge feature-branch  
git push origin main
```

---

## ✅ Done

You’ve successfully created a PR and merged it into `main`

## Environment Configuration

Create a `.env` file for environment variables (not tracked in git):

```env
PORT=3000
NODE_ENV=development
```

### Code Style Guidelines

- Use consistent indentation (2 spaces)
- Follow EJS templating best practices
- Ensure responsive design compatibility
- Test on multiple browsers and devices

## Contact

- **Organization**: Association of Tamil Canadian Community (ATCC)
- **Email**: <reachatcc@gmail.com>
- **Instagram**: [@atcc.ca](https://www.instagram.com/atcc.ca/)
- **Facebook**: [ATCC Canada](https://www.facebook.com/atccc.ca/)
- **LinkedIn**: [ATCC LinkedIn](https://www.linkedin.com/company/94783062)
- **Twitter**: [@atcc_ca](https://twitter.com/atcc_ca)
- **YouTube**: [ATCC YouTube](https://www.youtube.com/channel/UCaZ2zNvfGFVKMgAcF9bFpPw)

## Acknowledgments

- **Template Base**: ChariTeam - Free Nonprofit Website Template
- **Template Source**: [HTML Codex](https://htmlcodex.com/)
- **Icons**: [Font Awesome](https://fontawesome.com/)
- **Animations**: [Animate.css](https://animate.style/)
- **Carousel**: [Owl Carousel](https://owlcarousel2.github.io/OwlCarousel2/)
- **Framework**: [Bootstrap](https://getbootstrap.com/)

## 👥 Code Owners

This repository uses a [`CODEOWNERS`](./.github/CODEOWNERS) file to enforce mandatory code reviews for specific files and directories.

### 🔒 Purpose

- Automatically request reviews from the appropriate owners when a pull request is opened.
- Enforce review from specific individuals or teams before merging.

### ✅ Current Code Owners

| Path          | Code Owners                                                                 |
|---------------|------------------------------------------------------------------------------|
| `*`           | [@sylvester-francis](https://github.com/sylvester-francis),[@shiva-shankari-rajaram](https://github.com/shiva-shankari-rajaram),[@atcccanada](https://github.com/atcccanada) |

### 🛠️ How It Works

- The `CODEOWNERS` file is located in `.github/CODEOWNERS`.
- Any pull request that changes a file matching a path in `CODEOWNERS` will automatically request reviews from the listed users.
- If branch protection rules are enabled (e.g., "Require review from Code Owners"), at least one listed owner (who is not the PR author) must approve the changes.

### 🚫 Important Notes

- **You cannot approve your own pull request**, even if you're a listed code owner.
- Make sure there is **at least one other code owner** with write access who can approve your PRs.

### 📚 Learn More

- [GitHub Docs: About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

## Version History

- **v1.0.0** - Initial release with Node.js/Express migration
  - Converted from static HTML to dynamic EJS templates
  - Added CI/CD pipeline with GitHub Actions
  - Implemented modern development workflow
  - Added comprehensive documentation

---
**Note**: This project has been completely refactored from a static HTML website to a modern Node.js/Express application with EJS templating, providing better maintainability, scalability, and development experience.
