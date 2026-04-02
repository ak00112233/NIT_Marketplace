const userRepository = require('../repositories/userRepository');
const productRepository = require('../repositories/productRepository');
const activityRepository = require('../repositories/activityRepository');

const adminService = {
    // Get pending products with seller details
    getPendingProducts: async () => {
        const products = await productRepository.find({ isApproved: false });
        return await Promise.all(products.map(async p => {
            const seller = await userRepository.findById(p.seller);
            return { 
                ...(p.toObject ? p.toObject() : p), 
                seller: seller ? { name: seller.name, email: seller.email } : null 
            };
        }));
    },

    // Approve or reject product
    approveProduct: async (productId, approve, adminId) => {
        if (approve) {
            return await productRepository.update(productId, { isApproved: true, status: 'available', actionByAdmin: adminId });
        } else {
            // Mark as rejected instead of deleting
            return await productRepository.update(productId, { isApproved: false, status: 'rejected_by_admin', actionByAdmin: adminId });
        }
    },

    // Get all users without passwords
    getUsers: async () => {
        const users = await userRepository.find();
        return users.map(u => {
            const userObj = u.toObject ? u.toObject() : u;
            const { password, ...rest } = userObj;
            return rest;
        });
    },

    // Get admin dashboard statistics
    getStats: async () => {
        const users = await userRepository.find();
        const products = await productRepository.find({});
        const liveListings = products.filter(p => p.status === 'available' && p.isApproved).length;
        const pendingListings = products.filter(p => 
            p.isApproved === false && 
            p.status !== 'rejected_by_admin' && 
            p.status !== 'deleted_by_admin'
        ).length;

        return {
            totalUsers: users.length,
            liveListings,
            pendingListings,
            totalVolume: products.reduce((acc, p) => acc + (p.price || 0), 0)
        };
    },

    // Get all products with seller context
    getAllProducts: async () => {
        const products = await productRepository.find({});
        // Sort newest first
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return await Promise.all(products.map(async p => {
            const seller = await userRepository.findById(p.seller);
            return { 
                ...(p.toObject ? p.toObject() : p), 
                seller: seller ? { name: seller.name, email: seller.email, rollNo: seller.rollNo } : null 
            };
        }));
    },

    // Force delete product by admin
    deleteProductAdmin: async (productId, adminId) => {
        const result = await productRepository.update(productId, { status: 'deleted_by_admin', actionByAdmin: adminId });
        // Remove from all wishlists
        await activityRepository.removeFromAllWishlists(productId);
        return result;
    }
};

module.exports = adminService;

