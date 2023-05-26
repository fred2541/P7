function genererErreur(message) {
    throw new Error(message);
  }

module.exports = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);

    try {
        (Number(bookObject.year) > new Date(Date.now()).getFullYear()) || (Number(bookObject.year) < 0) ? genererErreur("Année de publication") : null ;
        (bookObject.title.length > 80) || (bookObject.title.length <= 0) ? genererErreur("Titre") : null ;
        (bookObject.author.length > 80) || (bookObject.author.length <= 0) ? genererErreur("Auteur") : null ;
        (bookObject.genre.length > 80) || (bookObject.genre.length <= 0) ? genererErreur("Genre") : null ;        
        next();
    } catch(error) {
        res.status(400).json({ message: error.toString() + ' invalide!' });
    }
};