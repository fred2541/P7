const express = require('express');
const router = express.Router();


const bookCtrl = require('../controllers/books');
const auth = require('../middleware/auth');
const checkInput = require('../middleware/check_Inputs_Add_Book');
const checkRatings = require('../middleware/rating');
const resizeImage = require('../middleware/resize');
const { RLRead, RLWrite } = require('../middleware/rate_limiter');


const multer = require('../middleware/multer-config');
const deleteImage = require('../middleware/deleteImage');

/////////////////////////////////////////////////////////////////////////////////
/////////// No security, just return books, BestRating and Book//////////////////
router.get('/', RLRead, bookCtrl.books);/////////////////////////////////////////
router.get('/bestrating', RLRead, bookCtrl.bookBestRating);/////////////////////
router.get('/:id', RLRead, bookCtrl.bookId);/////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////
/////////// Secure routes......./////////////////////////////////////////////////
router.post('/', RLWrite, auth, multer, resizeImage, checkInput, bookCtrl.booksAdd);
router.post('/:id/rating', RLWrite, auth, checkRatings, bookCtrl.bookRating);
router.put('/:id', RLWrite, auth, multer, deleteImage, resizeImage, bookCtrl.bookUpdate);
router.delete('/:id', RLWrite, auth, deleteImage, bookCtrl.bookDelete);


module.exports = router;