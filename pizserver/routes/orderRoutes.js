const express = require('express');
const Order = require('../models/order'); // Modello per gli ordini
const router = express.Router();

// Crea un nuovo ordine
router.post('/', async (req, res) => {
  try {
    const { cliente, pizze, totale, indirizzo, stato } = req.body;

    const nuovoOrdine = new Order({
      cliente,
      pizze,
      totale,
      indirizzo,
      stato,
      dataCreazione: new Date()
    });

    await nuovoOrdine.save();
    res.status(201).json(nuovoOrdine);
  } catch (err) {
    res.status(500).json({ message: 'Errore nella creazione dell\'ordine', error: err });
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
