const express = require('express');
const { getMe, updateMe, changePassword, uploadAvatar, removeAvatar, getActivity, getWishlist } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/me', protect, getMe);

// Update user contact details
router.put('/me',              protect, updateMe);

// Change account password
router.put('/me/password',     protect, changePassword);

// Upload/update avatar
router.post('/me/avatar',      protect, uploadAvatar);

// Remove avatar
router.delete('/me/avatar',    protect, removeAvatar);

router.get('/me/wishlist', protect, getWishlist);

// Get activity summary
router.get('/activity',        protect, getActivity);

module.exports = router;
