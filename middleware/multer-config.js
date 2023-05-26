const multer = require('multer');

const storage = multer.memoryStorage(); // No support for filename in memoryStorage !!!
const upload = multer({ storage: storage }).single('image');

const multerMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
      next();
    });
  };

module.exports = multerMiddleware;