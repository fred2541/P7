const sharp = require('sharp');

const Book = require('../models/Books');
const FOLDER_IMAGES = process.env.FOLDER_IMAGES;


const resizeImage = (req, res, next) => {
//    console.log(req.params);
    if (!req.file) {
    // No picture
    console.log('no picture to resize');
    const bookObject = req.body; // read body book info
    req.body.book = JSON.stringify(bookObject); // put book in req.body.book
    return next();
  }
  console.log('resize image');
  
  const fileNameImage = FOLDER_IMAGES + req.file.originalname.split('.').shift() + '-' + Date.now() + '.webp'; // filename without .ext
  const fullUrlImage = 'http://localhost:4000/' + fileNameImage;
  const bookObject = JSON.parse(req.body.book);
  bookObject.imageUrl = fullUrlImage;
  req.body.book = JSON.stringify(bookObject); // Add fullurl to request

  // resize and convert to webp
  sharp(req.file.buffer)
    .resize(800)
    .webp({ quality: 90 })
    .toFile(fileNameImage, (err, info) => {
        if (err) {
            callback(err);
          }
    });
    next();
};

module.exports = resizeImage;
