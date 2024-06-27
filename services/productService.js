const ProductModel = require('../models/product');

module.exports = {
    getAll: (req, res) => {
        ProductModel.find({})
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                res.status(500).json(error);
            })
    },
    getOne: async (req, res) => {
        try {
            const product = await ProductModel.findById(req.params.id);
            res.json(product);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    add: async (req, res) => {
        try {
            const savedProduct = await new ProductModel(req.body).save();
            res.json(savedProduct);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    delete: async (req, res) => {
        try {
            await ProductModel.deleteOne({ _id: req.params.id });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    update: async (req, res) => {
        try {
            const product = await ProductModel.findByIdAndUpdate(req.params.id,
                { $set: req.body },
                {
                    new: true
                }
            );
            res.json(product);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    search: async (req, res) => {
        try {
            const { name, page = 1, limit = 10 } = req.body;
            const query = {};
    
            if (name) {
                query.name = { $regex: new RegExp(name, 'i') };
            }
    
            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            };
    
            const result = await ProductModel.paginate(query, options);
    
            res.json(result);
        } catch (error) {
            console.error("Error in search function:", error);
            res.status(500).json(error);
        }
    },
    filterCategory: async (req, res) => {
        try {
            const { category } = req.query;
            const query = {};

            if (category) {
                query.category = category;
            }

            const products = await ProductModel.find(query);
            res.json(products);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}