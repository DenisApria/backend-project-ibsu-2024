const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
        size: { type: String, required: true },
        color: { type: String },
        quantity: { type: Number }
    }]
},{
    collection: 'carts',
    timestamps: true,
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeoutMS: 30000
    },
    read: 'nearest'
})

const Model = mongoose.model('Cart', cartSchema);
module.exports = Model;