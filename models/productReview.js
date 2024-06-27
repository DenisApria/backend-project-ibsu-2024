const mongoose = require('mongoose');

const productReviewSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: {type: Number, required: true, min: 1, max: 5},
    imageURL: [{ type: String }],
    text: { type: String, required: true }
}, {
    collection: 'reviews',
    timestamps: true,
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeoutMS: 30000
    },
    read: 'nearest'
});

const Model = mongoose.model('Review', productReviewSchema);
module.exports = Model;