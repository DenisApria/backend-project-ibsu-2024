const UserModel = require('../models/user');
const CouponModel = require('../models/coupon');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    register: async (req, res) => {
        try {
            if (!req.body.username || !req.body.email || !req.body.password) {
                return res.status(400).json({
                    message: 'required_fields_are_missing'
                });
            }
            const exists = await UserModel.findOne({
                username: req.body.username
            });
            if (exists) {
                return res.status(409).json({
                    message: 'user_already_exists'
                });
            }
            const hashPassword = bcrypt.hashSync(req.body.password, 10);

            const savedUser = await new UserModel({
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
                permits: req.body.permits
            }).save();

            const token = jwt.sign({
                id: savedUser._id,
                username: savedUser.username,
                permits: savedUser.permits
            }, process.env.SECRET_KEY);

            res.json({ token });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    login: async (req, res) => {
        try {
            const user = await UserModel.findOne({
                username: req.body.username
            });

            if (!user) {
                return res.status(404).json({
                    message: 'user_not_found'
                });
            }

            if (bcrypt.compareSync(req.body.password, user.password)) {
                const token = jwt.sign({
                    id: user._id,
                    username: user.username,
                    permits: user.permits
                }, process.env.SECRET_KEY);
    
                res.json({ token });
            } else {
                return res.status(404).json({
                    message: 'user_not_found'
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    assignCoupons: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(404).json({
                    message: 'user_not_found'
                });
            }

            const coupons = await CouponModel.find({ membership: user.membership });

            if (!coupons || coupons.length === 0) {
                return res.status(404).json({
                    message: 'coupons_not_found'
                });
            }

            let assignedCount = 0;

            for (const coupon of coupons) {
                const existingCoupon = user.coupons.find(c => c.coupon.equals(coupon._id));

                if (!existingCoupon) {
                    user.coupons.push({ coupon: coupon._id, used: false });
                    assignedCount++;
                }
            }

            if (assignedCount > 0) {
                await user.save();
                res.json({ message: assignedCount + '_coupons_assigned_successfully' });
            } else {
                res.json({ message: 'all_available_coupons_assigned' });
            }
        } catch (error) {
            console.log('error_assigning_coupons' + error);
            res.status(500).send(error);
        }
    },
    fetchCoupons: async (req, res) => {
        try {
            const user = await UserModel.findById(req.params.id);

            if (!user) {
                return res.status(404).json({
                    message: 'user_not_found'
                });
            }

            res.json(user.coupons);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    managePermit: async (req, res) => {
        try {
            const userId = req.params.id;
            const { permits } = req.body;

            if (!Array.isArray(permits)) {
                return res.status(400).json({ message: 'permits_should_be_an_array' });
            }

            const user = await UserModel.findByIdAndUpdate(
                userId,
                { permits },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'user_not_found' });
            }

            res.json({ message: 'permits_updated_successfully', user });
        } catch (error) {
            res.status(500).json(error);
        }
    }
}