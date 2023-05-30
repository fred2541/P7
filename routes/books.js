const express = require('express');
const router = express.Router();


const bookCtrl = require('../controllers/books');
const auth = require('../middleware/auth');
const checkInput = require('../middleware/check_Inputs_Add_Book');
const checkRatings = require('../middleware/rating');
const resizeImage = require('../middleware/resize');

const multer = require('../middleware/multer-config');
const deleteImage = require('../middleware/deleteImage');

/////////////////////////////////////////////////////////////////////////////////
/////////// No security, just return books, BestRating and Book//////////////////
router.get('/', bookCtrl.books);/////////////////////////////////////////////////
router.get('/bestrating', bookCtrl.bookBestRating);//////////////////////////////
router.get('/:id', bookCtrl.bookId);/////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////
/////////// Secure routes......./////////////////////////////////////////////////
router.post('/', auth, multer, resizeImage, checkInput, bookCtrl.booksAdd);
router.post('/:id/rating', auth, checkRatings, bookCtrl.bookRating);
router.put('/:id', auth, multer, deleteImage, resizeImage, bookCtrl.bookUpdate);
router.delete('/:id', auth, deleteImage, bookCtrl.bookDelete);


module.exports = router;