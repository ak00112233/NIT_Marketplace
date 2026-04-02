const express = require('express');
const { login, register, sendOtp, verifyOtpAndRegister, sendPasswordChangeOtp, verifyOtpAndChangePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Authentication endpoints
router.post('/register', register);
router.post('/login', login);

// OTP-based signup
router.post('/send-otp', sendOtp);
router.post('/verify-otp-register', verifyOtpAndRegister);

// OTP-based password change (requires login)
router.post('/send-password-change-otp', protect, sendPasswordChangeOtp);
router.post('/verify-otp-change-password', protect, verifyOtpAndChangePassword);

module.exports = router;
