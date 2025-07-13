const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/atcc-website');

async function createAdmin() {
    try {
        console.log('Creating admin user...');
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists:', existingAdmin.email);
            process.exit(0);
        }
        
        // Create admin user
        const adminData = {
            username: 'admin',
            email: 'admin@atcccanada.ca', // Change this to your email
            password: 'admin123', // Change this to a secure password
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            isActive: true
        };
        
        const admin = new User(adminData);
        await admin.save();
        
        console.log('✓ Admin user created successfully!');
        console.log('Email:', adminData.email);
        console.log('Password:', adminData.password);
        console.log('⚠️  Please change the password after first login!');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();