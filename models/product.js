const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true},
    description: { type: String },
    imageURL: { type: String },
    details: [{
        size: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 }
    }],
    category: { type: String, required: true },
    color: [{ type: String }],
    originCountry: { type: String },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
}, {
    collection: 'products',
    timestamps: true,
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeoutMS: 30000
    },
    read: 'nearest'
});

productSchema.plugin(mongoosePaginate);

const Model = mongoose.model('Product', productSchema);
module.exports = Model;