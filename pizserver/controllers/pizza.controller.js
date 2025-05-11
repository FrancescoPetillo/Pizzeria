const Pizza = require('../models/pizza');  // Assicurati che il modello sia correttamente importato

// Funzione per ottenere tutte le pizze
exports.getAllPizzas = (req, res) => {
  Pizza.find({}, (err, pizzas) => {
    if (err) {
      return res.status(500).send({ message: 'Errore nel recupero delle pizze' });
    }
    res.status(200).json(pizzas);
  });
};

// Funzione per ottenere una pizza per ID
exports.getPizzaById = (req, res) => {
  const pizzaId = req.params.id;

  Pizza.findById(pizzaId, (err, pizza) => {
    if (err) {
      return res.status(500).send({ message: 'Errore nel recupero della pizza' });
    }
    if (!pizza) {
      return res.status(404).send({ message: 'Pizza non trovata' });
    }
    res.status(200).json(pizza);
  });
};

// Funzione per creare una nuova pizza
exports.createPizza = (req, res) => {
  const pizzaData = req.body;  // I dati della pizza vengono passati nel corpo della richiesta

  const newPizza = new Pizza(pizzaData);

  newPizza.save((err, pizza) => {
    if (err) {
      return res.status(500).send({ message: 'Errore nella creazione della pizza', error: err });
    }
    res.status(201).json({ message: 'Pizza creata con successo', pizza });
  });
};

// Funzione per aggiornare una pizza esistente
exports.updatePizza = (req, res) => {
  const pizzaId = req.params.id;
  const updatedData = req.body;  // I nuovi dati per aggiornare la pizza

  Pizza.findByIdAndUpdate(pizzaId, updatedData, { new: true }, (err, pizza) => {
    if (err) {
      return res.status(500).send({ message: 'Errore nell\'aggiornamento della pizza', error: err });
    }
    if (!pizza) {
      return res.status(404).send({ message: 'Pizza non trovata' });
    }
    res.status(200).json({ message: 'Pizza aggiornata con successo', pizza });
  });
};

// Funzione per eliminare una pizza
exports.deletePizza = (req, res) => {
  const pizzaId = req.params.id;

  Pizza.findByIdAndDelete(pizzaId, (err, pizza) => {
    if (err) {
      return res.status(500).send({ message: 'Errore nell\'eliminazione della pizza', error: err });
    }
    if (!pizza) {
      return res.status(404).send({ message: 'Pizza non trovata' });
    }
    res.status(200).json({ message: 'Pizza eliminata con successo' });
  });
};
