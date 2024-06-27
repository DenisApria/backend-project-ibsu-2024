const ProductReviewModel = require('../models/productReview');

module.exports = {
    getAll: (req, res) => {
        ProductReviewModel.find({})
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                res.status(500).json(error);
            })
    },
    add: async (req, res) => {
        try {
            const savedReview = await new ProductReviewModel(req.body).save();
            res.json(savedReview);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    delete: async (req, res) => {
        try {
            await ProductReviewModel.deleteOne({ _id: req.params.id });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    update: async (req, res) => {
        try {
            const review = await ProductReviewModel.findByIdAndUpdate(req.params.id,
                { $set: req.body },
                {
                    new: true
                }
            );
            res.json(review);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getProductRreviews: async (req, res) => {
        try {
            const productId = req.params.id;
            const reviews = await ProductReviewModel.find({ product: productId })
                .populate('user', 'username');
            res.json(reviews);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}