const Admin = require('../models/Admin');

const adminRepository = {
    // Find admin by query
    findOne: async (query) => {
        return await Admin.findOne(query);
    },

    // Find admin by ID
    findById: async (id) => {
        return await Admin.findById(id);
    },

    // Create admin
    create: async (data) => {
        return await Admin.create(data);
    },

    update: async (id, data) => {
        return await Admin.findByIdAndUpdate(id, data, { new: true });
    }
};

module.exports = adminRepository;
