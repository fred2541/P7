const Book = require('../models/Books');

module.exports = (req, res, next) => {
  try {
    const rating = req.body.rating;
    (rating < 0 || rating > 5) ? null : undefined;
    
    Book.findOne({'ratings.userId': req.auth.userId})
        .then(rating => {
            if (rating) { // if rating FALSE = no rating for this user OR livre dont exist !
              res.status(500).json({ message: 'Vous avez déjà voté ou livre inexistant !' });
            } else {
              next();
            }
          })
  } catch (error) {

  }
        
};