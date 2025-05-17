const express = require('express');
const Order = require('../models/Order'); // Usa la O maiuscola!
const { body, validationResult, param } = require('express-validator');
const mongoose = require('mongoose');
const router = express.Router();

// Crea un nuovo ordine
router.post('/', [
  body('name').isLength({ min: 3 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('address').notEmpty().trim().escape(),
  body('products').isArray({ min: 1 }),
  body('products.*.productId').custom((value) => mongoose.Types.ObjectId.isValid(value)),
  body('products.*.quantity').isInt({ min: 1, max: 100 }),
  body('totalAmount').isFloat({ min: 0 }),
  body('paymentMethod').isIn(['card', 'cash']),
  body('cardLast4').isLength({ min: 4, max: 4 }).isNumeric(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation error', errors: errors.array() });
  }
  try {
    const { name, email, address, products, totalAmount, paymentMethod, cardLast4 } = req.body;
    // Calcolo server-side del totale per prevenire manipolazioni
    let serverTotal = 0;
    for (const p of products) {
      if (!mongoose.Types.ObjectId.isValid(p.productId)) {
        return res.status(400).json({ message: 'Invalid productId' });
      }
      // TODO: Recupera prezzo reale dal DB prodotto e moltiplica per quantità
      // serverTotal += prezzo * p.quantity;
    }
    // if (Math.abs(serverTotal - totalAmount) > 0.01) {
    //   return res.status(400).json({ message: 'Total amount mismatch' });
    // }
    const nuovoOrdine = new Order({
      name,
      email,
      address,
      products,
      totalAmount, // In produzione usare serverTotal
      paymentMethod,
      cardLast4,
      createdAt: new Date()
    });
    await nuovoOrdine.save();
    res.status(201).json({ message: 'Order created', orderId: nuovoOrdine._id });
  } catch (err) {
    res.status(500).json({ message: 'Order creation error' });
  }
});

// Ottieni tutti gli ordini
router.get('/', async (req, res) => {
  try {
    const ordini = await Order.find();
    res.status(200).json(ordini);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero degli ordini' });
  }
});

// Ottieni un ordine specifico
router.get('/:id', [
  param('id').custom((value) => mongoose.Types.ObjectId.isValid(value)),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid order id' });
  }
  try {
    const ordine = await Order.findById(req.params.id);
    if (!ordine) {
      return res.status(404).json({ message: 'Ordine non trovato' });
    }
    res.status(200).json(ordine);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero dell\'ordine' });
  }
});

// Aggiorna lo stato di un ordine
router.put('/:id', [
  param('id').custom((value) => mongoose.Types.ObjectId.isValid(value)),
  body('stato').optional().isIn(['pending', 'paid', 'shipped', 'delivered'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation error', errors: errors.array() });
  }
  try {
    const ordine = await Order.findById(req.params.id);
    if (!ordine) {
      return res.status(404).json({ message: 'Ordine non trovato' });
    }
    ordine.stato = req.body.stato || ordine.stato;
    await ordine.save();
    res.status(200).json(ordine);
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'aggiornamento dell\'ordine' });
  }
});

// Elimina un ordine
router.delete('/:id', [
  param('id').custom((value) => mongoose.Types.ObjectId.isValid(value)),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid order id' });
  }
  try {
    const ordine = await Order.findById(req.params.id);
    if (!ordine) {
      return res.status(404).json({ message: 'Ordine non trovato' });
    }
    await ordine.remove();
    res.status(200).json({ message: 'Ordine eliminato con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'eliminazione dell\'ordine' });
  }
});

module.exports = router;
