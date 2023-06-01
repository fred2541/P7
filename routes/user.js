const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();


const userCtrl = require('../controllers/user');
const checkPassword = require('../middleware/check_password');

router.post('/signup', checkPassword , userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;