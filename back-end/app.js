//config.js exporta string za povezavo s podatkovno bazo
const dataInfo = require("./config.js");
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
require('events').EventEmitter.prototype._maxListeners = 100;


//povezava z bazo
const mongoose = require('mongoose');
//Set up default mongoose connection
mongoose.connect(dataInfo.database, { useNewUrlParser:true });
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const indexRouter = require('./routes/index');
const orderRouter = require('./routes/orderRoutes');
const usersRouter = require('./routes/userRoutes');
const itemRouter = require('./routes/itemRoutes');
const photoRouter = require('./routes/photoRoutes');
const mailboxRouter = require('./routes/mailboxRoutes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
//CORS
const cors = require('cors');
const allowedOrigins = ['http://localhost:4200','http://localhost:3000',
  'http://yourapp.com'];
app.use(cors({
  credentials: true,
  origin: function(origin, callback){
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//seja
const session = require('express-session');
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/photos', photoRouter);
app.use('/mailboxes', mailboxRouter);
app.use('/items', itemRouter);
app.use('/orders', orderRouter);

app.set('json spaces', 1)

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