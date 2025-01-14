var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products')
var categoriesRouter = require('./routes/categories');
var chartRouter = require('./routes/chart');
var apiRouter = require('./routes/api')

var app = express();

app.use(session({
  secret: 'secret_key', // Chuỗi bí mật, bạn có thể thay đổi nó
  resave: false,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/chart', chartRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
