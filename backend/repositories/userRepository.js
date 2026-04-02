const User = require('../models/User');

const userRepository = {
    // Find multiple users
    find: async (query = {}) => {
        return await User.find(query);
    },

    // Find single user
    findOne: async (query) => {
        return await User.findOne(query);
    },

    // Find user by ID
    findById: async (id) => {
        return await User.findById(id);
    },

    // Create new user
    create: async (data) => {
        return await User.create(data);
    },

    // Update user
    update: async (id, data) => {
        return await User.findByIdAndUpdate(id, data, { returnDocument: 'after' });
    }
};

module.exports = userRepository;
