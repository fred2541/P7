const Book = require("../models/Books");
const fs = require("fs"); // for delete file in FS

const FOLDER_IMAGES = process.env.FOLDER_IMAGES;

const deleteImage = (req, res, next) => {
  if (req.params.hasOwnProperty("id")) {
    // Delete old image file before
    const bookId = req.params.id;
    Book.findOne({ _id: bookId }) // Get the book by id
      .then((books) => {
        const fileToDelete = books.imageUrl.split("/").slice(-1);
        const pathToDelete = FOLDER_IMAGES + fileToDelete;
        try {
          fs.unlinkSync(pathToDelete);
          console.log("Delete: " + pathToDelete);
          const bookObject = req.body; // read body book info
          req.body.book = JSON.stringify(bookObject); // put book in req.body.book
          next();
        } catch (err) {
          console.error("Impossible de supprimer le fichier :", err);
        }
      })
      .catch((err) => {});
  }
};

module.exports = deleteImage;
