const auth = require("../middleware/auth");
const Book = require("../models/Books");
const FOLDER_IMAGES = process.env.FOLDER_IMAGES;

exports.books = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.bookId = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.booksAdd = (req, res, next) => {
  console.log("Ajout d'un livre");

  const bookObject = JSON.parse(req.body.book);

  try {
    const book = new Book({
      userId: req.auth.userId,
      ...bookObject,
    });
    book
      .save()
      .then(() => res.status(201).json({ message: "livre ajouté avec succès" }))
      .catch((error) => res.status(400).json({ error }));
  } catch (error) {
    res.status(400).json({ message: error.toString() });
  }
};

exports.bookRating = (req, res, next) => {
  const userId = req.auth.userId;
  const rating = req.body.rating;

  // verifier si le userid n'a pas deja noter !!!!!! en cas d'utilisation avec postman !!!!
  Book.findOneAndUpdate(
    { _id: req.params.id }, // request Book by _id
    { $push: { ratings: { userId: userId, grade: rating } } }, // Add the ratings posted by Front
    { new: true } // return the book _id with the push for calculate average with the new note
  )
    .then((updatedBook) => {
      const ratingsCount = updatedBook.ratings.length; // number of ratings
      const totalRating = updatedBook.ratings.reduce(
        (sum, r) => sum + r.grade,
        0
      ); // Add all ratings number to totalRating
      updatedBook.averageRating = totalRating / ratingsCount; // number of ratings / totalRating = averageRatings
      updatedBook.averageRating = Math.round(updatedBook.averageRating); // if 0,5 round to 1
      console.log(updatedBook.averageRating);
      return updatedBook.save(); // Save the averageRatings
    })
    .then((updatedBook) => {
      // Succes and return book to FrontEnd
      res.status(201).json({ ...updatedBook._doc });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.bookUpdate = (req, res, next) => {
  console.log("Update book");
  const bookObject = JSON.parse(req.body.book);
  const bookIdToUpdate = req.params.id;
  const userId = req.auth.userId;

  try {
    Book.findOneAndUpdate({ _id: bookIdToUpdate, userId: userId }, { ...bookObject})
      .then(() => res.status(200).json({ message: "livre modifier avec succès" }))
  } catch (error) {
    res.status(403).json({ error});
  }
};

exports.bookDelete = (req, res, next) => {
  console.log("Delete book");
  const idToDelete = req.params.id;

  Book.findByIdAndDelete(idToDelete)
    .then((deletedField) => {
      if (deletedField) {
        res.status(200).json({ message: 'OK' });
      } else {
        console.log('Tentative de suppresson d\'un livre inéxistant !');
        res.status(200).json({ message: 'Livre supprimer avec succes' });
      }
    })
};

exports.bookBestRating = (req, res, next) => {
  console.log("BestRating");
  
  Book.find()
    .sort({ averageRating: -1}) // best rating in first
    .limit(3) // max result
    .exec() // run the request
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    })

};