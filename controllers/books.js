const auth = require('../middleware/auth');
const Book = require('../models/Books');
const FOLDER_IMAGES = process.env.FOLDER_IMAGES;



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
    const fullUrlImage = 'http://localhost:4000/' + fileNameImage;

    sharp(req.file.buffer) // request image buffer from multer.memoryStorage
        .resize(800)
        .webp({ quality: 90 })
        .toFile(fileNameImage, (err, info) => {
            if (err) {
                callback(err);
              }
        });

    const bookObject = JSON.parse(req.body.book);
 
    bookObject.imageUrl = fullUrlImage;
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

exports.bookRating = (req, res, next) => {
  const userId = req.auth.userId;
  const rating = req.body.rating;

  // console.log(req.params.id);
  Book.findOneAndUpdate(
    { '_id': req.params.id }, // request Book by _id
    { $push: { 'ratings': { userId: userId, grade: rating } } }, // Add the ratings posted by Front
    { new: true } // return the book _id with the push for calculate average with the new note
  )
    .then(updatedBook => {
      const ratingsCount = updatedBook.ratings.length; // number of ratings
      const totalRating = updatedBook.ratings.reduce((sum, r) => sum + r.grade, 0); // Add all ratings number to totalRating
      updatedBook.averageRating = totalRating / ratingsCount; // number of ratings / totalRating = averageRatings
      updatedBook.averageRating = Math.round(updatedBook.averageRating); // if 0,5 round to 1
      console.log(updatedBook.averageRating);
      return updatedBook.save(); // Save the averageRatings
    })
    .then(updatedBook => { // Succes and return book to FrontEnd
      res.status(200).json({ ...updatedBook._doc });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};