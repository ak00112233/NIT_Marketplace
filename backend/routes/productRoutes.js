const express = require('express');
const productController = require('../controllers/productController');
const productImageController = require('../controllers/productImageController');
const { protect, optionalAuth } = require('../middlewares/authMiddleware');
const router = express.Router();

// Note: specific paths before /:id catch-all

// Query products
router.post('/query',        optionalAuth, productController.queryProducts);

// Wishlist toggle
router.post('/wishlist',     protect, productController.syncWishlist);

// Get marketplace stats
router.get('/stats/public',  productController.getPublicStats);

// Get user products
router.get('/me',            protect, productController.getMyProducts);

// Create listing
router.post('/',             protect, productController.createProduct);

// Update status
router.put('/:id/status',   protect, productController.updateProductStatus);

// Update details
router.patch('/:id',         protect, productController.updateProduct);

// Delete listing
router.delete('/:id',        protect, productController.deleteProduct);

// Upload image
router.post('/:id/image',    protect, productImageController.uploadImage);

// Remove image
router.delete('/:id/image',  protect, productImageController.removeImage);

// Get product details
router.get('/:id',           productController.getProductById);

module.exports = router;
