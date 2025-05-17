var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose'); // Connessione a MongoDB
const pizzaRoutes = require('./routes/pizzaRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Connessione a MongoDB
const mongoURI = 'mongodb://franvittore1926:FrancescoVittorio1926.@127.0.0.1:27017/pizzeria?authSource=pizzeria';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //tls: true,  
  //tlsCAFile: 'C:\\Users\\fpeti\\Desktop\\mongodb-certs\\certificato.pem'  // percorso al certificato CA
}).then(() => {
  console.log('✅ Connesso a MongoDB con SSL/TLS');
}).catch(err => {
  console.error('❌ Errore di connessione a MongoDB:', err);
});

// Importazione delle rotte
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const orderRoutes = require('./routes/orderRoutes'); // Importa le rotte per gli ordini
const authRoutes = require('./routes/auth'); // << IMPORT QUI

var app = express(); // << CREA L'APP QUI

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());

// Rate limit: max 5 richieste al minuto sulla rotta /checkout
app.use('/checkout', rateLimit({
  windowMs: 60 * 1000,
  max: 5
}));

app.use(session({
  secret: 'metti-qui-una-stringa-sicura',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: mongoURI }),
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 }
}));

// Rotte
app.use('/auth', authRoutes); // << ORA QUI È CORRETTO
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/orders', orderRoutes);  // Aggiungi le rotte per gli ordini
app.use('/api/pizzas', pizzaRoutes); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;