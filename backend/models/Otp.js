const mongoose = require('mongoose');

/**
 * OTP Model
 * Stores one-time passwords temporarily in MongoDB.
 * The `expireAt` field uses a TTL index — MongoDB automatically
 * deletes the document when `expireAt` time has passed.
 * This replaces the in-memory Map which doesn't survive across
 * Vercel serverless function invocations.
 */
const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,  // One active OTP per email at a time
        index: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
        required: true,
        // MongoDB TTL index: automatically deletes this document when expireAt is reached
        index: { expires: 0 },
    },
});

module.exports = mongoose.model('Otp', otpSchema);
