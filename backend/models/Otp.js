const mongoose = require('mongoose');

// OTP model with TTL index for automatic deletion
// Purpose: 'signup' or 'password-change'
const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
    },
    purpose: {
        type: String,
        required: true,
        enum: ['signup', 'password-change'],
        default: 'signup',
    },
    otp: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
        required: true,
        // TTL index: auto-delete when expired
        index: { expires: 0 },
    },
});

// Unique index per email + purpose
otpSchema.index({ email: 1, purpose: 1 }, { unique: true });

module.exports = mongoose.model('Otp', otpSchema);
