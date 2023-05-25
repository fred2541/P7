const auth = require('../middleware/auth');
const Book = require('../models/Books');

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
    const sharp = require('sharp'); // OK here or go to top of file ?
    const imageBuffer = req.file.buffer;
    const bookObject = JSON.parse(req.body.book);
 
    delete bookObject.averageRating; // no averageRating on new book

    // console.log(imageBuffer);
    
    try {
        Number(bookObject.year) > new Date(Date.now()).getFullYear() ? genererErreur("Année de publication invalide!") : undefined ;
        Number(bookObject.year) < 0 ? genererErreur("Année de publication invalide!") : undefined ;
        bookObject.title.length > 80 ? genererErreur("Titre trop long!") : undefined ;
        const book = new Book({
            userId: req.auth.userId,
            ...bookObject,

        });
        book.save()
            .then(() => res.status(500).json({ message: "ok :)"})) // Verifier le type de reponse !!!!
            .catch(error => res.status(400).json({ error }));
    } catch (error) { res.status(400).json({ message: error.toString() }) }

    
    //console.log(book);
    
    // res.status(500).json({ message: "ok :)"})
    
};