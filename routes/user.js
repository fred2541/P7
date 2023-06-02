const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();


const userCtrl = require('../controllers/user');
const checkPassword = require('../middleware/check_password');
const { RLSignup, RLRead } = require('../middleware/rate_limiter');


router.post('/signup', RLSignup, checkPassword , userCtrl.signup);
router.post('/login', RLRead, userCtrl.login);

module.exports = router;