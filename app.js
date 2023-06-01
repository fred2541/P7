const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // https://medium.com/codait/environment-variables-or-keeping-your-secrets-secret-in-a-node-js-app-99019dfff716

process.env.FOLDER_IMAGES = 'images/'; // Dont remove this lign !!!!
const DB_LOGIN = process.env.DB_LOGIN;
const DB_PASSWD = process.env.DB_PASSWD;
const CLUSTER_ADDR = process.env.CLUSTER_ADDR;


const app = express();

const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/books');

const imagesDirectory = path.join(__dirname, 'images');

mongoose.connect('mongodb+srv://' + DB_LOGIN +':' + DB_PASSWD + '@' + CLUSTER_ADDR + '/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));  // utiliser error pour faire remonter l'erreur en elle meme

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