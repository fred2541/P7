const Book = require('../models/Books');

module.exports = (req, res, next) => {
  try {
    const rating = req.body.rating;
    (rating < 0 || rating > 5) ? null : undefined;
    const bookId = req.params.id;
    
    Book.findOne({ _id: bookId, 'ratings.userId': req.auth.userId})
        .then(rating => {
            if (rating) { // if rating FALSE = no rating for this user OR livre dont exist !
              res.status(401).json({ message: 'Vous avez déjà voté ou livre inexistant !' });
            } else {
              next();
            }
          })
  } catch (error) {

  }
        
};