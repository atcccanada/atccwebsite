const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    ownerName: {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        }
    },
    contactInfo: {
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true
        },
        website: {
            type: String
        }
    },
    location: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        province: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        }
    },
    category: {
        type: String,
        required: true,
        enum: [
            'restaurant',
            'retail',
            'professional_services',
            'healthcare',
            'beauty_wellness',
            'automotive',
            'real_estate',
            'education',
            'technology',
            'construction',
            'entertainment',
            'finance',
            'grocery',
            'other'
        ]
    },
    description: {
        type: String,
        maxlength: 500
    },
    services: [{
        type: String,
        trim: true
    }],
    logo: {
        type: String
    },
    images: [{
        type: String
    }],
    businessHours: {
        monday: { open: String, close: String, closed: { type: Boolean, default: false } },
        tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
        wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
        thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
        friday: { open: String, close: String, closed: { type: Boolean, default: false } },
        saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
        sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
    },
    yearEstablished: {
        type: Number
    },
    socialMedia: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

businessSchema.virtual('fullOwnerName').get(function() {
    return `${this.ownerName.firstName} ${this.ownerName.lastName}`;
});

businessSchema.virtual('fullAddress').get(function() {
    return `${this.location.address}, ${this.location.city}, ${this.location.province} ${this.location.postalCode}`;
});

businessSchema.index({ businessName: 'text', description: 'text', services: 'text' });
businessSchema.index({ category: 1 });
businessSchema.index({ 'location.city': 1 });
businessSchema.index({ 'location.province': 1 });

module.exports = mongoose.model('Business', businessSchema);