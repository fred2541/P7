const sharp = require('sharp');
const Book = require('../models/Books');
const FOLDER_IMAGES = process.env.FOLDER_IMAGES;


const resizeImage = async (req, res, next) => {
    if (!req.file) {
    // No picture
    const bookObject = req.body; // read body book info
    req.body.book = JSON.stringify(bookObject); // put book in req.body.book
    return next();
  }
  
  const fileNameImage = FOLDER_IMAGES + req.file.originalname.split('.').shift() + '-' + Date.now() + '.webp'; // filename without .ext
  const fullUrlImage = 'http://localhost:4000/' + fileNameImage;
  const bookObject = JSON.parse(req.body.book);
  bookObject.imageUrl = fullUrlImage;
  req.body.book = JSON.stringify(bookObject);
  // console.log(req.body.book);

  // resize and convert to webp
  try {
    await sharp(req.file.buffer)
      .resize(800)
      .webp({ quality: 90 })
      .toFile(fileNameImage);
    next();
  } catch (err) {
    console.error("Impossible de travailler l'image :", err);
    next();
  }  
};

module.exports = resizeImage;
