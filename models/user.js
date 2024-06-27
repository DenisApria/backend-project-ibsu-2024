const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    membership: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },
    coupons: [{
        coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
        used: { type: Boolean, default: false },
    }],
    permits: [{ type: String }],
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, {
    collection: 'users',
    timestamps: true,
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeoutMS: 30000
    },
    read: 'nearest'
});

const Model = mongoose.model('User', userSchema);
module.exports = Model;