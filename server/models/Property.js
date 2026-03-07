const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    pincode: { type: String },
    image: { type: String }, // URL or path
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);
