var express = require('express');
const { route } = require('.');
var router = express.Router();
const connectDb = require('../models/db');
const session = require('express-session');
/* GET home page. */
router.get('/', async(req, res, next) => {
  const db = await connectDb();
  const productsCollection = db.collection('products');
  const productHome = await productsCollection.find().toArray();
  const categoriesCollection = db.collection('categories');
  const categoriesHome = await categoriesCollection.find().toArray();
  const loggerUser = req.session.user;
  res.render('index', {productHome, categoriesHome, loggerUser});
  // res.render('index', {categoriesHome});
});

module.exports = router;
