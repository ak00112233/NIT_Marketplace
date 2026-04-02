const authService = require('../services/authService');

// Login user
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const data = await authService.login(email, password);
        res.json(data);
    } catch (error) {
        const isAuthError = error.message === 'Invalid email or password';
        res.status(isAuthError ? 401 : 500).json({ message: error.message });
    }
};

// Register new user
const register = async (req, res) => {
    try {
        const data = await authService.register(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};

// Send OTP for signup
const sendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        await authService.sendOtp(email);
        res.json({ message: 'OTP sent successfully.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Verify OTP and register
const verifyOtpAndRegister = async (req, res) => {
    const { otp, ...userData } = req.body;
    try {
        const data = await authService.verifyOtpAndRegister(userData, otp);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Send OTP for password change
const sendPasswordChangeOtp = async (req, res) => {
    const { currentPassword } = req.body;
    if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required.' });
    }
    try {
        await authService.sendPasswordChangeOtp(req.user._id, currentPassword);
        res.json({ message: 'OTP sent to your registered email.' });
    } catch (error) {
        const status = error.message === 'Current password is incorrect.' ? 401 : 400;
        res.status(status).json({ message: error.message });
    }
};

// Verify OTP and change password
const verifyOtpAndChangePassword = async (req, res) => {
    const { otp, newPassword } = req.body;
    if (!otp || !newPassword) {
        return res.status(400).json({ message: 'OTP and new password are required.' });
    }
    try {
        await authService.verifyOtpAndChangePassword(req.user._id, otp, newPassword);
        res.json({ message: 'Password changed successfully.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { login, register, sendOtp, verifyOtpAndRegister, sendPasswordChangeOtp, verifyOtpAndChangePassword };
