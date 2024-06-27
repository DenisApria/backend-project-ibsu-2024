var express = require('express');
var router = express.Router();

const couponService = require('../services/couponService');
const ApiSecurity = require('../middleware/apiSecurity');

router.get('/all', ApiSecurity.requirePermits('manage_coupons'), couponService.getAll);
router.post('/add', ApiSecurity.requirePermits('manage_coupons'), couponService.add);
router.delete('/:id', ApiSecurity.requirePermits('manage_coupons'), couponService.delete);
router.put('/:id', ApiSecurity.requirePermits('manage_coupons'), couponService.update);

module.exports = router;