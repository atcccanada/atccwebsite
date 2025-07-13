const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/atcc-website');

async function makeUserAdmin() {
    try {
        const email = process.argv[2]; // Get email from command line argument
        
        if (!email) {
            console.log('Usage: node scripts/make-user-admin.js <email>');
            console.log('Example: node scripts/make-user-admin.js user@example.com');
            process.exit(1);
        }
        
        console.log(`Looking for user with email: ${email}`);
        
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log('❌ User not found with that email');
            process.exit(1);
        }
        
        // Update user role to admin
        user.role = 'admin';
        user.isActive = true;
        await user.save();
        
        console.log('✅ User promoted to admin successfully!');
        console.log('Name:', user.firstName, user.lastName);
        console.log('Email:', user.email);
        console.log('Role:', user.role);
        
        process.exit(0);
    } catch (error) {
        console.error('Error updating user:', error);
        process.exit(1);
    }
}

makeUserAdmin();