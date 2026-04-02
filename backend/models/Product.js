const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, minlength: 2, maxlength: 100 },
    description: { type: String, required: true, minlength: 3, maxlength: 1000 },
    price: { type: Number, required: true, min: 0 },
    category: { 
        type: String, 
        required: true, 
        enum: ["Books", "Electronics", "Cycle", "Hostel Stuff", "Academic", "Other"] 
    },
    condition: { 
        type: String, 
        required: true, 
        enum: ["New", "Used", "Damaged", "Lightly Used"] 
    },
    location: { type: String, default: 'Campus' },
    isApproved: { type: Boolean, default: false },
    status: { 
        type: String, 
        default: 'available', 
        enum: ["available", "sold", "reserved", "deleted_by_admin", "rejected_by_admin"] 
    },
    img: { type: String, default: null },
    actionByAdmin: { type: mongoose.Schema.Types.ObjectId, default: null }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
