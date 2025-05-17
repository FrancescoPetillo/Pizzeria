const express = require('express');
const Order = require('../models/Order'); // Usa la O maiuscola!
const router = express.Router();

// Crea un nuovo ordine
router.post('/', async (req, res) => {
  try {
    const { name, email, address, products, totalAmount, paymentMethod, cardLast4 } = req.body;
    const nuovoOrdine = new Order({
      name,
      email,
      address,
      products,
      totalAmount,
      paymentMethod,
      cardLast4,
      createdAt: new Date()
    });
    await nuovoOrdine.save();
    res.status(201).json(nuovoOrdine);
  } catch (err) {
    res.status(500).json({ message: 'Order creation error', error: err });
  }
});

// Ottieni tutti gli ordini
router.get('/', async (req, res) => {
  try {
    const ordini = await Order.find();
    res.status(200).json(ordini);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero degli ordini', error: err });
  }
});

// Ottieni un ordine specifico
router.get('/:id', async (req, res) => {
  try {
    const ordine = await Order.findById(req.params.id);
    if (!ordine) {
      return res.status(404).json({ message: 'Ordine non trovato' });
    }
    res.status(200).json(ordine);
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero dell\'ordine', error: err });
  }
});

// Aggiorna lo stato di un ordine
router.put('/:id', async (req, res) => {
  try {
    const ordine = await Order.findById(req.params.id);
    if (!ordine) {
      return res.status(404).json({ message: 'Ordine non trovato' });
    }

    ordine.stato = req.body.stato || ordine.stato;

    await ordine.save();
    res.status(200).json(ordine);
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'aggiornamento dell\'ordine', error: err });
  }
});

// Elimina un ordine
router.delete('/:id', async (req, res) => {
  try {
    const ordine = await Order.findById(req.params.id);
    if (!ordine) {
      return res.status(404).json({ message: 'Ordine non trovato' });
    }

    await ordine.remove();
    res.status(200).json({ message: 'Ordine eliminato con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore nell\'eliminazione dell\'ordine', error: err });
  }
});

module.exports = router;
