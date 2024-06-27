var express = require('express');
var router = express.Router();

const productReviewService = require('../services/productReviewService');

router.get('/all', productReviewService.getAll);
router.post('/add', productReviewService.add);
router.delete('/:id', productReviewService.delete);
router.put('/:id', productReviewService.update);

router.get('/product/:id', productReviewService.getProductRreviews);

module.exports = router;