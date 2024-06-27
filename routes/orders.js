var express = require('express');
var router = express.Router();

const orderService = require('../services/orderService');
const ApiSecurity = require('../middleware/apiSecurity');

router.get('/:id/list', ApiSecurity.requireLogin, orderService.ordersList);
router.post('/:id/place', ApiSecurity.requireLogin, orderService.placeOrder);
router.put('/:orderId', ApiSecurity.requirePermits('manage_orders'), orderService.updateStatus);

module.exports = router;