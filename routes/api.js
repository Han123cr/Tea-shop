var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

function checkFileUpLoad(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Bạn chỉ được upload file ảnh'));
    }
    cb(null, true);
}

//Upload file
let upload = multer({ storage: storage, fileFilter: checkFileUpLoad });

//Import model
const connectDb = require('../models/db');
const { ObjectId } = require('mongodb');

//Trả về danh sách sản phẩm
router.get('/products', async (req, res, next)=>{
    const db = await connectDb();
    const productsCollection = db.collection('products');
    const products = await productsCollection.find().toArray();
    if(products){
        res.status(200).json(products);
    }else{
        res.status(404).json({message: 'Không tìm thấy sản phẩm'});
    }
})

//Thêm sản phẩm
router.post('/products', upload.single('img'), async (req, res, next) => {
    let {name, price, categoryId, img, description} = req.body;
    // let img = [req.file.originalname];
    const db = await connectDb();
    const productsCollection = db.collection('products');
    let lastProduct = await productsCollection.find().sort({ id: -1 }).limit(1).toArray();
    let id = lastProduct[0] ? lastProduct[0].id + 1 : 1;
    let hot = "0";
    let newProduct = { id, name, price, categoryId, img, description, hot };
    await productsCollection.insertOne(newProduct);
    if(newProduct){
        res.status(200).json(newProduct);
    }else{
        res.status(404).json({ message: 'Not found' });
    }
})

//Sửa sản phẩm
router.put('/products/:id', upload.single('img'), async(req, res, next) => {
    let id = req.params.id;
    const db = await connectDb();
    const productsCollection = db.collection('products');
    let { name, price, categoryId, img, description} = req.body;
    let editProduct = {name, price, categoryId, img, description};
    product = await productsCollection.updateOne({ id: parseInt(id)}, { $set: editProduct })
    if(product){
        res.status(200).json(editProduct);
    }else{
        res.status(404).json({ message: 'Not found' });
    }
})

//Xóa sản phẩm
router.delete('/products/:id', async(req, res, next) => {
    let id = req.params.id;
    const db = await connectDb();
    const productsCollection = db.collection('products');
    let product = await productsCollection.deleteOne({ id: parseInt(id) });
    if(product){
        res.status(200).json({ message: 'Xóa thành công'});
    }else{
        res.status(404).json({ message: 'Not found' });
    }
})

router.get('/products/hot', authenToken, async(req, res, next) => {
    const db = await connectDb();
    const productsCollection = db.collection('products');
    const hotproducts = await productsCollection.find({status: 1}).toArray();
    if(hotproducts){
        res.status(200).json({hotproducts});
    }else{
        res.status(404).json({message: 'Không tìm thấy sản phẩm'});
    }
})

router.get('/products/new', async(req, res, next) => {
    const db = await connectDb();
    const productsCollection = db.collection('products');
    const newproducts = await productsCollection.find({status: 0}).toArray();
    if(newproducts){
        res.status(200).json({newproducts});
    }else{
        res.status(404).json({message: 'Không tìm thấy sản phẩm'});
    }
})

router.get('/products/viewed', async(req, res, next) => {
    const db = await connectDb();
    const productsCollection = db.collection('products');
    const viewproducts = await productsCollection.find().sort({views: -1}).toArray();
    if(viewproducts){
        res.status(200).json({viewproducts});
    }else{
        res.status(404).json({message: 'Không tìm thấy sản phẩm'});
    }
})

router.get('/products/search/:name', async(req, res, next) => {
    let productName = req.params.name;
    const db = await connectDb();
    const productsCollection = db.collection('products');
    const searchProduct = await productsCollection.find({name: { $regex: productName, $options: 'i'} }).toArray();
    if(searchProduct){
        res.status(200).json({ searchProduct });
    }else{
        res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
})

router.get('/products/:id', async (req, res, next) => {
    const db = await connectDb();
    const productsCollection = db.collection('products');
    let id = req.params.id;
    const product = await productsCollection.findOne({id: parseInt(id)});
    if(product){
        res.status(200).json(product);
    }else{
        res.status(404).json({message: 'Không tìm thấy sản phẩm'})
    }
})

//Trả về danh sách danh mục
router.get('/categories', authenToken, async (req, res, next)=>{
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    const categories = await categoriesCollection.find().toArray();
    if(categories){
        res.status(200).json(categories);
    }else{
        res.status(404).json({message: 'Không tìm thấy sản phẩm'});
    }
})

router.post('/categories', upload.single(''), async (req, res, next) => {
    let{ title } = req.body;
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    let lastCategory = await categoriesCollection.find().sort({ id: -1 }).limit(1).toArray();
    let id = lastCategory[0] ? lastCategory[0].id + 1 : 1;
    let newCategory = { id, title};
    await categoriesCollection.insertOne(newCategory);
    if(newCategory){
        res.status(200).json(newCategory);
    }else{
        res.status(404).json({message: 'Not found'});
    }
})

router.put('/categories/:id', upload.single(''), async(req, res, next) => {
    let id = req.params.id;
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    let {title} = req.body;
    let editCategory = {title};
    category = await categoriesCollection.updateOne({id: parseInt(id) }, {$set: editCategory})
    if(category){
        res.status(200).json(editCategory);
    }else{
        res.status(404).json({message: 'Not found'})
    }
})

router.delete('/categories/:id', async(req, res, next) => {
    let id = req.params.id;
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    let category = await categoriesCollection.deleteOne({ id: parseInt(id) });
    if(category){
        res.status(200).json({message: 'Xóa thành công'});
    }else{
        res.status(404).json({message: 'Thất bại'});
    }
})

router.get('/categories/:id', async (req, res, next)=>{
    const db = await connectDb();
    const categoriesCollection = db.collection('categories');
    let id = req.params.id;
    category = await categoriesCollection.findOne({ id: parseInt(id) });
    if(category){
        res.status(200).json(category);
    }else{
        res.status(404).json({message: 'Không tìm thấy sản phẩm'});
    }
})

router.get('/products/categoryId/:id', async(req, res, next) => {
    const categoryId = req.params.id;
    const db = await connectDb();
    const productsCollection = db.collection('products');
    const products = await productsCollection.find({ categoryId: parseInt(categoryId) }).toArray();
    if(products){
        res.status(200).json({ products });
    }else{
        res.status(404).json({ message: 'Sản phẩm không tồn tại '});
    }
})

//------------------------------------Đăng ký user---------------------//
router.post('/user/register', upload.single('img'), async(req, res, next) => {
    let {firstname, lastname, email, password} = req.body;
    const db = await connectDb();
    const usersCollection = db.collection('users');
    let user = await usersCollection.findOne({email: email});
    if(user){
        res.status(409).json({message: 'Email đã tồn tại'});
    }else{
        let lastuser = await usersCollection.find().sort({ id: -1 }).limit(1).toArray();
        let id = lastuser[0] ? lastuser[0].id+1 : 1;
        const salt = bcrypt.genSaltSync(10);
        let hashPassword = bcrypt.hashSync(password, salt);
        let newUser = {id: id, email, password: hashPassword, firstname, lastname, role: 0, trangthai: "active"};
        try{
            let result = await usersCollection.insertOne(newUser);
            console.log(result);
            res.status(200).json({message: 'Đăng ký thành công'});
        }catch(error) {
            console.error(error);
            res.status(500).json({message: 'Đăng ký thất bại'});
        }
    }
})

//------------------------------------Đăng nhập user---------------------//
const jwt  = require('jsonwebtoken');
router.post('/user/login', upload.single('img'), async(req, res, next) => {
    let{email, password} = req.body;
    const db = await connectDb();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email: email });
    if(user){
        if(bcrypt.compareSync(password, user.password)){
            const token = jwt.sign({email: user.email, role: user.role}, 'secretkey', {expiresIn: '100s'});
            res.status(200).json({user, token});
        }else{
            res.status(403).json({message: 'Email hoặc mật khẩu không chính xác'});
        }
    }else{
            res.status(403).json({message: 'Email hoặc mật khẩu không chính xác'});
    }
});

function authenToken (req, res, next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err){
                res.status(403).json({message: 'Không có quyền truy cập'});
            }else{
                next();
            }
        })
    }else{
        res.status(403).json({message: 'Không có quyền truy cập'});
    }
}
module.exports = router;