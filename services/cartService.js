const CartModel = require('../models/cart');
const ProductModel = require('../models/product');

module.exports = {
    fetchCart: async (req, res) => {
        try {
            const userId = req.params.id;
            const cart = await CartModel.findOne({ user: userId }).populate('items.product');
            
            res.json(cart);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    add: async (req, res) => {
        try {
            const userId = req.params.id;
            const { productId, size, quantity, color } = req.body;

            const product = await ProductModel.findById(productId);

            if (!product) {
                return res.status(404).json({ message: 'product_not_found' });
            }

            const selectedSize = product.details.find(detail => detail.size === size);

            if (!selectedSize) {
                return res.status(404).json({ message: 'no_size_for_product' });
            }
            if (selectedSize.stock < quantity) {
                return res.status(400).json({ message: 'no_stock_for_product' });
            }

            let cart = await CartModel.findOne({ user: userId });

            if (!cart) {
                cart = new CartModel({ user: userId, items: [] });
            }

            const existingItem = cart.items.find(item => item.product.equals(productId));

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({
                    product: productId,
                    size: size,
                    quantity: quantity,
                    color: color
                });
            }

            await Promise.all([product.save(), cart.save()]);

            res.json(cart);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    delete: async (req, res) => {
        try {
            const userId = req.params.id;
            const productIdToRemove = req.params.productId;

            const cart = await CartModel.findOneAndUpdate(
                { user: userId },
                { $pull: { items: { product: productIdToRemove } } },
                { new: true }
            ).populate('items.product');

            if (!cart) {
                return res.status(404).json({ message: 'cart_not_found' });
            }

            res.json({ message: 'item_deleted' });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    clearCart: async (req, res) => {
        try {
            const userId = req.params.id;

            let cart = await CartModel.findOne({ user: userId })
            
            if (!cart) {
                return res.status(404).json({ message: 'cart_not_found' });
            }

            cart.items = [];

            await cart.save();
            res.json({ message: 'cart_cleared_successfully' });
        } catch (error) {
            res.status(500).json(error);
        }
    }
};
