var express = require('express');
const { route } = require('.');
var router = express.Router();
const connectDb = require('../models/db');

const multer = require('multer');
//Thiết lập nơi lưu trữ và tên file
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

//----------------------------LOAD PRODUCT----------------------------//
/* GET home page. */
router.get('/', async(req, res, next) => {
  const db = await connectDb();
  const productsCollection = db.collection('products');
  const products = await productsCollection.find().toArray();
  res.render('product', { products });
});

//-----------------------------ADD PRODUCT-----------------------------//
router.get('/addproduct', function(req, res, next) {
  res.render('addProduct');
})

function checkFileUpLoad(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Bạn chỉ được upload file ảnh'));
  }
  cb(null, true);
}

let upload = multer({ storage: storage, fileFilter: checkFileUpLoad });

router.post('/addproduct', upload.single('img'), async(req, res, next) => {
  const db = await connectDb();
  const productsCollection = db.collection('products');
  let {name, price, description, categoryId} = req.body;
  let img = [req.file.originalname];
  let lastProduct = await productsCollection.find().sort({ id: -1 }).limit(1).toArray();
  let id = lastProduct[0] ? lastProduct[0].id + 1 : 1;
  let newProduct = {id, img, price, name, description, categoryId};
  await productsCollection.insertOne(newProduct);
  res.redirect('/product');
})
//-----------------------------EDIT PRODUCT-----------------------------------//

router.get('/editproduct/:id', async(req, res, next) => {
  const db = await connectDb();
  const productsCollection = db.collection('products');
  const id = req.params.id;
  const product = await productsCollection.findOne({ id:parseInt(id) });
  res.render('editProduct', {product});
})

router.post('/editproduct', upload.single('img'), async(req, res, next) => {
  const db = await connectDb();
  const productsCollection = db.collection('products');
  let {id, name, price, description, categoryId} = req.body;
  let img = req.file ? [req.file.originalname] : [req.body.imgOld];
  let editProduct = {name, price, categoryId, img, description};
  await productsCollection.updateOne({ id: parseInt(id) }, { $set: editProduct });
  res.redirect('/product');
})

//-----------------------------DELETE PRODUCT----------------------------------//
router.get('/delete/:id', async(req, res) => {
  let id = req.params.id;
  const db = await connectDb();
  const productsCollection = db.collection('products');
  await productsCollection.deleteOne({ id: parseInt(id) });
  res.redirect('/product');
})

module.exports = router;