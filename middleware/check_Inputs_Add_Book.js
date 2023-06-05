function genererErreur(message) {
    throw new Error(message);
  }

const titleRegex = /^[a-zA-Z0-9\s!:.'?_]{1,80}$/; // a-z A-Z 0-9 /s(espace)  !?-_ (special charactere)
const authorRegex = /^[a-zA-Z\s'-]{1,80}$/;
const genreRegex = /^[a-zA-Z\s]{1,80}$/;
const ratingRegex = /^[1-5]$/; // only 1-5

module.exports = (req, res, next) => {
    try {
        const bookObject = JSON.parse(req.body.book);
        // Check if input valide format
        (Number(bookObject.year) > new Date(Date.now()).getFullYear()) || (Number(bookObject.year) < 0) ? genererErreur("Année de publication") : null ;
        !bookObject.title.match(titleRegex) ? genererErreur("Titre") : null ;
        !bookObject.author.match(authorRegex) ? genererErreur("Auteur") : null ;
        !bookObject.genre.match(genreRegex) ? genererErreur("Genre") : null ;
        if (req.route.methods.post) { // no ratings or average on put methode
        !bookObject.ratings[0].grade.toString().match(ratingRegex) ? genererErreur("Vote") : null ;
        !bookObject.averageRating.toString().match(ratingRegex) ? genererErreur("Vote") : null ;
        }
        next();
    } catch(error) {
        console.log(error);
        res.status(400).json({ message: error.toString() + ' invalide!' });
    }
};