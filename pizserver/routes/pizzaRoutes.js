const express = require('express');
const router = express.Router();
const pizzaController = require('../controllers/pizza.controller'); // Assicurati che il percorso sia corretto

// Rotte per le pizze
router.get('/', pizzaController.getAllPizzas);  // Ottieni tutte le pizze
router.get('/:id', pizzaController.getPizzaById);  // Ottieni una pizza per ID
router.post('/', pizzaController.createPizza);  // Crea una nuova pizza
router.put('/:id', pizzaController.updatePizza);  // Modifica una pizza esistente
router.delete('/:id', pizzaController.deletePizza);  // Elimina una pizza

module.exports = router;
