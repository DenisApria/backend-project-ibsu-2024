var express = require('express');
var router = express.Router();

const userService = require('../services/userService');

router.post('/register', userService.register);
router.post('/login', userService.login);
router.post('/:id/assign-coupons', userService.assignCoupons);
router.get('/:id/coupons', userService.fetchCoupons);

module.exports = router;