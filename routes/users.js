var express = require('express');
var router = express.Router();

const userService = require('../services/userService');
const ApiSecurity = require('../middleware/apiSecurity');

router.post('/register', userService.register);
router.post('/login', userService.login);
router.post('/:id/assign-coupons', ApiSecurity.requireLogin, userService.assignCoupons);
router.get('/:id/coupons', ApiSecurity.requireLogin, userService.fetchCoupons);
router.put('/:id/manage-user-permit', userService.managePermit);

module.exports = router;