var express = require('express');
var router = express.Router();

const cartService = require('../services/cartService');
const ApiSecurity = require('../middleware/apiSecurity');

router.get('/:id', ApiSecurity.requireLogin, cartService.fetchCart);
router.post('/:id/add', ApiSecurity.requireLogin, cartService.add);
router.delete('/:id/remove/:productId', ApiSecurity.requireLogin, cartService.delete);
router.delete('/:id/clear', ApiSecurity.requireLogin, cartService.clearCart);

module.exports = router;