var express = require('express');
var router = express.Router();

const productService = require('../services/productService');
const ApiSecurity = require('../middleware/apiSecurity');

router.get('/all', productService.getAll);
router.get('/:id', productService.getOne);
router.post('/add', ApiSecurity.requirePermits('manage_products'), productService.add);
router.delete('/:id', ApiSecurity.requirePermits('manage_products'), productService.delete);
router.put('/:id', ApiSecurity.requirePermits('manage_products'), productService.update);

router.post('/search', productService.search);
router.get('/filter', productService.filterCategory);

module.exports = router;