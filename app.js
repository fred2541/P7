const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // https://medium.com/codait/environment-variables-or-keeping-your-secrets-secret-in-a-node-js-app-99019dfff716
// ADD .env file with:
// RANDOM_TOKEN_SECRET=YourSecretToken
// DB_LOGIN=YouLogin
// DB_PASSWD=YourPasswd
// CLUSTER_ADDR=ClusterAdresse


const DB_LOGIN = process.env.DB_LOGIN;
const DB_PASSWD = process.env.DB_PASSWD;
const CLUSTER_ADDR = process.env.CLUSTER_ADDR;


const app = express();
const router = express.Router();

const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/books');

mongoose.connect('mongodb+srv://' + DB_LOGIN +':' + DB_PASSWD + '@' + CLUSTER_ADDR + '/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);



module.exports = app;