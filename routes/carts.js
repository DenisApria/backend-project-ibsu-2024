var express = require('express');
var router = express.Router();

const cartService = require('../services/cartService');

router.get('/:id', cartService.fetchCart);
router.post('/:id/add', cartService.add);
router.delete('/:id/remove/:productId', cartService.delete);
router.delete('/:id/clear', cartService.clearCart);

module.exports = router;