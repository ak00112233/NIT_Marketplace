const UserActivity = require('../models/UserActivity');

// Activity repository: user activity data access
const activityRepository = {
    // Get or create activity record
    getOrCreate: async (userId) => {
        let activity = await UserActivity.findById(userId);
        if (!activity) {
            activity = await UserActivity.create({ 
                _id: userId,
                wishlisted: [],
                listed: [],
                sold: [],
                img: null
            });
        }
        return activity;
    },

    // Get all activity records
    getAll: async () => {
        return await UserActivity.find({});
    },

    // Ensure all users have activity entries
    ensureAll: async (userIds) => {
        for (const userId of userIds) {
            await activityRepository.getOrCreate(userId);
        }
    },

    // Update activity record
    update: async (userId, patch) => {
        return await UserActivity.findByIdAndUpdate(userId, patch, { returnDocument: 'after' });
    },

    // Add product to listed array
    addListed: async (userId, productId) => {
        return await UserActivity.findByIdAndUpdate(
            userId, 
            { $addToSet: { listed: productId } }, 
            { returnDocument: 'after', upsert: true }
        );
    },

    // Mark product as sold
    markSold: async (userId, productId) => {
        return await UserActivity.findByIdAndUpdate(
            userId, 
            { $addToSet: { sold: productId } }, 
            { returnDocument: 'after', upsert: true }
        );
    },

    /**
     * When a product is deleted, remove it from ALL users' wishlisted lists
     * and from the seller's listed array.
     */
    removeProductEverywhereOnDelete: async (productId) => {
        await UserActivity.updateMany({}, {
            $pull: {
                wishlisted: productId,
                listed: productId,
                sold: productId
            }
        });
    },

    /**
     * Remove a product from every user's wishlist (without touching listed/sold).
     * Used when a product is marked sold or deleted by admin (product doc still exists).
     */
    removeFromAllWishlists: async (productId) => {
        await UserActivity.updateMany(
            { wishlisted: productId },
            { $pull: { wishlisted: productId } }
        );
    }
};

module.exports = activityRepository;

