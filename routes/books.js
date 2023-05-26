const express = require('express');
const router = express.Router();


const bookCtrl = require('../controllers/books');
const auth = require('../middleware/auth');
const checkInput = require('../middleware/check_Inputs_Add_Book');
const checkRatings = require('../middleware/rating');

const multer = require('../middleware/multer-config');

router.get('/', bookCtrl.books);
router.get('/:id', bookCtrl.bookId);


router.post('/', auth, multer, checkInput, bookCtrl.booksAdd);
router.post('/:id/rating', auth, checkRatings, bookCtrl.bookRating);

module.exports = router;