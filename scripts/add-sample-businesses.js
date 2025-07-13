const mongoose = require('mongoose');
const Business = require('../models/Business');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/atcc-website');

const sampleBusinesses = [
    {
        businessName: "Tamil Spice Restaurant",
        ownerName: {
            firstName: "Raj",
            lastName: "Kumar"
        },
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
        ownerName: {
            firstName: "Priya",
            lastName: "Sharma"
        },
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
        ownerName: {
            firstName: "Dr. Arun",
            lastName: "Patel"
        },
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

async function addSampleBusinesses() {
    try {
        console.log('Adding sample businesses...');
        
        for (const businessData of sampleBusinesses) {
            const existingBusiness = await Business.findOne({ 
                businessName: businessData.businessName 
            });
            
            if (!existingBusiness) {
                const business = new Business(businessData);
                await business.save();
                console.log(`✓ Added: ${businessData.businessName}`);
            } else {
                console.log(`- Skipped (exists): ${businessData.businessName}`);
            }
        }
        
        console.log('Sample businesses added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error adding businesses:', error);
        process.exit(1);
    }
}

addSampleBusinesses();