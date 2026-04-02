const adminService = require('../services/adminService');

const adminController = {
    // Get pending products awaiting approval
    getPendingProducts: async (req, res) => {
        try {
            const products = await adminService.getPendingProducts();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Approve or reject a product
    approveProduct: async (req, res) => {
        const { approve } = req.body;
        try {
            const result = await adminService.approveProduct(req.params.id, approve, req.user._id);
            if (approve) {
                res.json(result);
            } else {
                res.json({ message: 'Listing rejected and deleted' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get all registered users
    getUsers: async (req, res) => {
        try {
            const users = await adminService.getUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get marketplace statistics
    getStats: async (req, res) => {
        try {
            const stats = await adminService.getStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get all products on platform
    getAllProducts: async (req, res) => {
        try {
            const products = await adminService.getAllProducts();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Force delete inappropriate listing
    deleteProductAdmin: async (req, res) => {
        try {
            const result = await adminService.deleteProductAdmin(req.params.id, req.user._id);
            res.json({ message: 'Product deleted by admin', product: result });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = adminController;
