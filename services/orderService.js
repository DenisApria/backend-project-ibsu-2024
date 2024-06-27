const OrderModel = require('../models/order');
const CartModel = require('../models/cart');
const ProductModel = require('../models/product');
const UserModel = require('../models/user'); // Assuming you have a User model

module.exports = {
    placeOrder: async (req, res) => {
        try {
            const userId = req.params.id;
            const { shippingAddress, paymentMethod } = req.body;

            const cart = await CartModel.findOne({ user: userId }).populate('items.product');
            if (!cart) {
                return res.status(404).json({ message: 'cart_not_found' });
            }
            if (cart.items.length === 0) {
                return res.status(404).json({ message: 'cart_is_empty' });
            }

            let totalAmount = 0;
            cart.items.forEach(item => {
                const productDetail = item.product.details.find(detail => detail.size === item.size);
                totalAmount += productDetail.price * item.quantity;
            });

            // Create a new order
            const newOrderItems = [];
            cart.items.forEach(item => {
                newOrderItems.push({
                    product: item.product._id,
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity
                });
            });

            const newOrder = new OrderModel({
                user: userId,
                items: newOrderItems,
                totalAmount,
                shippingAddress,
                paymentMethod
            });

            const savedOrder = await newOrder.save();

            await UserModel.findByIdAndUpdate(userId, { $push: { orders: savedOrder._id } });

            for (const item of cart.items) {
                const product = await ProductModel.findById(item.product._id);
                const productDetail = product.details.find(detail => detail.size === item.size);
                productDetail.stock -= item.quantity;
                await product.save();
            }

            cart.items = [];
            await cart.save();

            res.json(savedOrder);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    ordersList: async (req, res) => {
        try {
            const userId = req.params.id;
            const orders = await OrderModel.find({ user: userId });

            res.json(orders);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    updateStatus: async (req, res) => {
        try {
            const orderId = req.params.orderId;
            const { status, paymentStatus } = req.body;

            if (!status && !paymentStatus) {
                return res.status(400).json({ message: 'provide_necessary_fields' });
            }

            const updateFields = {};
            if (status) {
                updateFields.status = status;
            }
            if (paymentStatus) {
                updateFields.paymentStatus = paymentStatus;
            }

            const updatedOrder = await OrderModel.findOneAndUpdate(
                { _id: orderId },
                { $set: updateFields },
                { new: true }
            );

            if (!updatedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.json({ message: 'updated_successfully' });
        } catch (error) {
            res.status(500).send(error);
        }
    }
}
