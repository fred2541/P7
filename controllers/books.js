const auth = require('../middleware/auth');
const Book = require('../models/Books');
const FOLDER_IMAGES = process.env.FOLDER_IMAGES;


function genererErreur(message) {
    throw new Error(message);
  }

exports.books = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json( books ))
        .catch( error => res.status(400).json({ error}));
};

exports.bookId = (req, res, next) => {
    Book.findOne({_id: req.params.id})
        .then(books => res.status(200).json( books ))
        .catch(error => res.status(400).json({ error }));
};

exports.booksAdd = (req, res, next) => {
    console.log('Ajout d\'un livre');
    const sharp = require('sharp');
    const fileNameImage = FOLDER_IMAGES + req.file.originalname.split('.').shift() + '-' + Date.now() + '.webp'; // filename without .ext

    console.log(fileNameImage);

    sharp(req.file.buffer) // request image buffer from multer.memoryStorage
        .resize(300)
        .webp({ quality: 90 })
        .toFile(fileNameImage, (err, info) => {
            if (err) {
                callback(err);
              }
        });

    const bookObject = JSON.parse(req.body.book);
 
    delete bookObject.averageRating; // no averageRating on new book

    try {
        const book = new Book({
            userId: req.auth.userId,
            ...bookObject,

        });
        book.save()
            .then(() => res.status(500).json({ message: "livre ajouté avec succès"})) // Pensez a changer le status en 200 !!!
            .catch(error => res.status(400).json({ error }));
    } catch (error) { res.status(400).json({ message: error.toString() }) }

    
    //console.log(book);
    
    // res.status(500).json({ message: "ok :)"})
    
};