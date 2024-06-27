var express = require('express');
var router = express.Router();

const orderService = require('../services/orderService');

router.get('/:id/list', orderService.ordersList);
router.post('/:id/place', orderService.placeOrder);
router.put('/:orderId', orderService.updateStatus);

module.exports = router;