const express = require('express');
const router = express.Router();


const bookCtrl = require('../controllers/books');
const auth = require('../middleware/auth');
const checkInput = require('../middleware/check_Inputs_Add_Book');

// const multer = require('../middleware/multer-config');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', bookCtrl.books);
router.get('/:id', bookCtrl.bookId);
// router.post('/', auth, multer, bookCtrl.booksAdd);
router.post('/', auth, upload.single('image'), checkInput, bookCtrl.booksAdd);

module.exports = router;