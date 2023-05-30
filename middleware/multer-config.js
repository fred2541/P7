const multer = require('multer');

const storage = multer.memoryStorage(); // No support for filename in memoryStorage !!!

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true); 
  } else {
      cb(null, false); // Gen fileFilter error
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single('image');


const multerMiddleware = (req, res, next) => {
    upload(req, res, (error) => {
      // if error undefined => ok no error, else 400 => stop the route
      error === undefined ? next() : res.status(400).json({ message: error });
    });
  };

module.exports = multerMiddleware;