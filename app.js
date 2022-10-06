const createError = require('http-errors');
const express = require('express');
const http = require('http').Server(express);
const path = require('path');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const indexRouter = require('./routes/index');
const layoutRouter = require('./routes/layout');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/layout', layoutRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.use(sessions({
  secret: "secrctekeykokdev",
  saveUninitialized: true,
  cookie: { maxAge: 10 * 1000 },
  resave: false
}));




module.exports = app;
