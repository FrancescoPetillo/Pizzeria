// Importazioni necessarie
var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const Ordine = require('../models/ordine'); // Percorso corretto

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

// Modelli Mongoose
let pizza = mongoose.model('pizza', pizSchema, 'pizza');
let toppingsandingredients = mongoose.model('toppingsandingredients', topSchema);

// Rotte
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/pizzas', function (req, res, next) {
  pizza.find({}, (err, docs) => {
	if (err) throw err;
	res.send(docs);
  });
});

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

router.get('/toppings', function (req, res, next) {
  toppingsandingredients.find({}, (err, docs) => {
	if (err) throw err;
	res.send(docs);
  });
});

// ✅ Rotta per visualizzare gli ordini
router.get('/ordini', async (req, res) => {
  try {
	const ordini = await Ordine.find();
	res.json(ordini);
  } catch (err) {
	res.status(500).json({ message: 'Errore nel recupero ordini.' });
  }
});

// ✅ POST /checkout con `cardLast4` incluso
router.post('/checkout', [
  check('name').isLength({ min: 3 }).trim().escape(),
  check('email').isEmail().normalizeEmail(),
  check('address').notEmpty().trim().escape(),
  check('cardLast4').isLength({ min: 4, max: 4 }).isNumeric(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, address, prodotti, cardLast4 } = req.body;

  try {
    const nuovoOrdine = new Ordine({
      name,
      email,
      address,
      cardLast4, // Salva solo le ultime 4 cifre
      prodotti: prodotti || []
    });

    await nuovoOrdine.save();

    res.json({ message: 'Pagamento ricevuto e ordine salvato!' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel salvataggio ordine.' });
  }
});

module.exports = router;


