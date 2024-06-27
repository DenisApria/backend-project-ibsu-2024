const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
        size: { type: String, required: true },
        color: { type: String },
        quantity: { type: Number }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    shippingAddress: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        postalCode: { type: String }
    },
    createdAt: { type: Date, default: Date.now },
    paymentMethod: { type: String },
    paymentStatus: { type: String, enum: ['Paid', 'Refunded'], default: 'Paid' }
}, {
    collection: 'orders',
    timestamps: true,
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeoutMS: 30000
    },
    read: 'nearest'
});

const Model = mongoose.model('Order', orderSchema);
module.exports = Model;