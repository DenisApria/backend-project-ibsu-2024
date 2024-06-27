var express = require('express');
var router = express.Router();

const productReviewService = require('../services/productReviewService');
const ApiSecurity = require('../middleware/apiSecurity');

router.get('/all', productReviewService.getAll);
router.post('/add', ApiSecurity.requireLogin, productReviewService.add);
router.delete('/:id', ApiSecurity.requireLogin, productReviewService.delete);
router.put('/:id', ApiSecurity.requireLogin, productReviewService.update);

router.get('/product/:id', productReviewService.getProductRreviews);

module.exports = router;