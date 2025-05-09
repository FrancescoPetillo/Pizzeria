// Importazioni necessarie
var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

// Schema di MongoDB
let mySchema = mongoose.Schema;
let pizSchema = new mySchema({
  id: String,
  type: String,
  price: String,
  name: String,
  image: String,
  description: String,
  ingredients: [{ id: String, iname: String }],
  topping: [{ id: String, tname: String, price: String }]
});

let topSchema = new mySchema({
  id: Number,
  image: String,
  price: Number,
  tname: String
});

// Connessione a MongoDB
mongoose.connect('mongodb://localhost:27017/pizzeria', (err) => {
  if (err) throw err;
  else {
    console.log('Connected to mongodb via mongoose');
  }
});

// Modelli Mongoose
let pizza = mongoose.model('pizza', pizSchema, 'pizza');
let toppingsandingredients = mongoose.model('toppingsandingredients', topSchema);

// Middleware
router.use(cors());
router.use(helmet());
router.use(express.json());

// Rate limit (max 5 richieste al minuto per il checkout)
router.use('/checkout', rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5               // Limite di 5 richieste
}));

// Rotte
// Pagina home
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// Ottieni tutte le pizze
router.get('/pizzas', function (req, res, next) {
  pizza.find({}, (err, docs) => {
    if (err) throw err;
    res.send(docs);
  });
});

// Ottieni una pizza per nome
router.get('/pizza/:name', function (req, res, next) {
  const pizzaName = req.params.name;
  pizza.findOne({ name: pizzaName }, (err, doc) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Errore nel server');
    }
    if (!doc) {
      return res.status(404).send('Pizza non trovata');
    }
    res.send(doc);
  });
});

// Ottieni tutti i topping e ingredienti
router.get('/toppings', function (req, res, next) {
  toppingsandingredients.find({}, (err, docs) => {
    if (err) throw err;
    res.send(docs);
  });
});

// Rotta POST per checkout
router.post('/checkout', [
  check('name').isLength({ min: 3 }).trim().escape(),
  check('email').isEmail().normalizeEmail(),
  check('address').notEmpty().trim().escape(),
  check('card').isLength({ min: 16, max: 16 }).isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Simula elaborazione ordine
  console.log('Ordine ricevuto:', {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address // NOTA: non salviamo la carta (simulazione sicura)
  });

  res.json({ message: 'Pagamento ricevuto. Grazie per l\'ordine!' });
});

module.exports = router;
