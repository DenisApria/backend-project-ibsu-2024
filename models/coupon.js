const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    membership: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], required: true },
    discount: { type: Number },
    validFrom: { type: Date },
    validUntil: { type: Date },
    moneyLimit: { type: Number }
}, {
    collection: 'coupons',
    timestamps: true,
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeoutMS: 30000
    },
    read: 'nearest'
});

const Model = mongoose.model('Coupon', userSchema);
module.exports = Model;