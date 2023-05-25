const multer = require('multer');
const sharp = require('sharp');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

const storage = multer.memoryStorage(); // No support for filename in memoryStorage !!!
const upload = multer({ storage: storage });

module.exports = multer({ upload }).single('image');