var express = require('express');
var router = express.Router();

const productService = require('../services/productService');

router.get('/all', productService.getAll);
router.get('/:id', productService.getOne);
router.post('/add', productService.add);
router.delete('/:id', productService.delete);
router.put('/:id', productService.update);

router.post('/search', productService.search);
router.get('/filter', productService.filterCategory);

module.exports = router;