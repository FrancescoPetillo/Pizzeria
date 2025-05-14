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

// Connessione a MongoDB usando variabile d'ambiente
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/pizzeria'; // Backup locale
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connesso a MongoDB');
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
app.use(cors());
app.use(helmet());

// Servire i file statici del frontend (Angular)
app.use(express.static(path.join(__dirname, 'dist', 'pizclient')));

// Rate limit: max 5 richieste al minuto sulla rotta /checkout
app.use('/checkout', rateLimit({
  windowMs: 60 * 1000,
  max: 5
}));

// Rotte
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/orders', orderRoutes);
app.use('/api/pizzas', pizzaRoutes);

// Catch all route per il frontend, restituire sempre index.html
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'pizclient', 'index.html'));
});

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
