const CouponModel = require('../models/coupon');

module.exports = {
    getAll: (req, res) => {
        CouponModel.find({})
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                res.status(500).json(error);
            })
    },
    add: async (req, res) => {
        try {
            const savedCoupon = await new CouponModel(req.body).save();
            res.json(savedCoupon);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    delete: async (req, res) => {
        try {
            await CouponModel.deleteOne({ _id: req.params.id });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    update: async (req, res) => {
        try {
            const coupon = await CouponModel.findByIdAndUpdate(req.params.id,
                { $set: req.body },
                {
                    new: true
                }
            );
            res.json(coupon);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}