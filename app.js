const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
process.env.FOLDER_IMAGES = 'images/'; // Dont remove this lign !!!!

const app = express();

const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/books');

const imagesDirectory = path.join(__dirname, 'images');

app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/images', express.static(imagesDirectory));
app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;