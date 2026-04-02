const express = require('express');
const { getPendingProducts, approveProduct, getUsers, getStats, getAllProducts, deleteProductAdmin } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Get pending products
router.get('/pending', protect, admin, getPendingProducts);

// Get stats
router.get('/stats', protect, admin, getStats);

// Approve product
router.put('/approve/:id', protect, admin, approveProduct);

// Get users
router.get('/users', protect, admin, getUsers);

// Get all products
router.get('/products', protect, admin, getAllProducts);

// Delete product
router.delete('/products/:id', protect, admin, deleteProductAdmin);

module.exports = router;
