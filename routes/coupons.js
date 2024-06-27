var express = require('express');
var router = express.Router();

const couponService = require('../services/couponService');

router.get('/all', couponService.getAll);
router.post('/add', couponService.add);
router.delete('/:id', couponService.delete);
router.put('/:id', couponService.update);

module.exports = router;