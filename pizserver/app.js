var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const pizzaRoutes = require('./routes/pizzaRoutes');


const session = require('express-session');
const MongoStore = require('connect-mongo');
const authRoutes = require('./routes/auth');

// Connessione a MongoDB
const mongoURI = 'mongodb://franvittore1926:FrancescoVittorio1926.@127.0.0.1:27017/pizzeria?authSource=pizzeria';

recupero-login
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connesso a MongoDB con SSL/TLS');
}).catch(err => {
  console.error('❌ Errore di connessione a MongoDB:', err);
});

// Importazione delle rotte
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const orderRoutes = require('./routes/orderRoutes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS per Angular
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(helmet());

// Servire i file statici del frontend (Angular)
app.use(express.static(path.join(__dirname, 'dist', 'pizclient')));

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
app.use('/auth', authRoutes);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/orders', orderRoutes);
app.use('/api/pizzas', pizzaRoutes);

recupero-login

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // Rispondi in JSON se la richiesta arriva da Angular, altrimenti continua con l'handler errori classico
  if (req.headers.accept && req.headers.accept.indexOf('application/json') > -1) {
    return res.status(404).json({ message: 'Not found' });
  }
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Se la richiesta arriva da Angular (accetta JSON), rispondi con JSON!
  if (req.headers.accept && req.headers.accept.indexOf('application/json') > -1) {
    res.status(err.status || 500).json({ message: err.message || 'Errore server' });
  } else {
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;