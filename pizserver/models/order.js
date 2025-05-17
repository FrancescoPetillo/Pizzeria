const mongoose = require('mongoose');

// Definiamo il modello per l'ordine
const orderSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  indirizzo: { type: String, required: true },
  prodotti: [
    {
      prodottoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prodotto', required: true },
      quantita: { type: Number, required: true }
    }
  ],
  totale: { type: Number, required: true },
  metodoPagamento: { type: String, required: true },
  cardLast4: { type: String, required: true },
  dataCreazione: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
