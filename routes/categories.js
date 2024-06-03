var express = require('express');
const { route } = require('.');
var router = express.Router();
const connectDb = require('../models/db');

//---------------------Multer lưu ảnh-----------------------//
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
//Kiểm tra file upload
function checkFileUpLoad(req, file, cb) {
if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Bạn chỉ được upload file ảnh'));
}
cb(null, true);
}
//Upload file
let upload = multer({ storage: storage, fileFilter: checkFileUpLoad });

//---------------------Trang chính--------------------------------------//
router.get('/', async(req, res) => {
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    const categories = await categoriesCollection.find().toArray();
    res.render('category', {categories});
})
//------------------------------ADD CATEGORY----------------------------//
router.get('/add', function(req, res, next) {
    res.render('addCategory');
})

router.post('/add', upload.single('img'), async(req, res, next) => {
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    let {title} = req.body;
    let img = [req.file.originalname];
    let lastCategory = await categoriesCollection.find().sort({ id: -1 }).limit(1).toArray();
    let id = lastCategory[0] ? lastCategory[0].id + 1 : 1;
    let newCategory = {id, title, img};
    await categoriesCollection.insertOne(newCategory);
    res.redirect('/categories');
})

//----------------------------DELETE CATEGORY----------------------//
router.get('/delete/:id', async(req, res, next) => {
    let id = req.params.id;
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    await categoriesCollection.deleteOne({ id: parseInt(id) });
    res.redirect('/categories');
})

//--------------------------EDIT CATEGORY--------------------------//
router.get('/edit/:id', async(req, res, next) => {
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    let id = req.params.id;
    let category = await categoriesCollection.findOne({ id: parseInt(id) });
    res.render('editCategory', {category});
})

router.post('/edit', upload.single('img'), async(req, res, next) => {
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    let{id, title} = req.body;
    let img = req.file ? [req.file.originalname] : [req.body.imgOld];
    let editCategory = {title, img};
    await categoriesCollection.updateOne({ id:parseInt(id) }, {$set: editCategory});
    res.redirect('/categories');
})
module.exports = router;