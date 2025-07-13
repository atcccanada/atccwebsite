const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
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
            type: String
        }
    },
    featuredImage: {
        type: String,
        default: null
    },
    images: [{
        type: String
    }],
    category: {
        type: String,
        enum: ['cultural', 'community', 'fundraising', 'educational', 'networking', 'entertainment'],
        default: 'community'
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ticketPrice: {
        type: Number,
        default: 0
    },
    maxAttendees: {
        type: Number,
        default: null
    },
    registrationRequired: {
        type: Boolean,
        default: false
    },
    registrationDeadline: {
        type: Date
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    externalLink: {
        type: String
    },
    contactEmail: {
        type: String
    },
    contactPhone: {
        type: String
    }
}, {
    timestamps: true
});

eventSchema.virtual('isPast').get(function() {
    return this.endDate < new Date();
});

eventSchema.virtual('isUpcoming').get(function() {
    return this.startDate > new Date();
});

eventSchema.virtual('isOngoing').get(function() {
    const now = new Date();
    return this.startDate <= now && this.endDate >= now;
});

eventSchema.pre('save', function(next) {
    const now = new Date();
    if (this.endDate < now) {
        this.status = 'completed';
    } else if (this.startDate <= now && this.endDate >= now) {
        this.status = 'ongoing';
    } else {
        this.status = 'upcoming';
    }
    next();
});

eventSchema.index({ startDate: -1 });
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Event', eventSchema);