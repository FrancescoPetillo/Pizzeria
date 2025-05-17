const mongoose = require('mongoose');

// Schema per i prodotti nel carrello
const prodottoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  image: { type: String, required: false }
}, { _id: false }); // evita _id automatico nei subdocumenti

// Schema principale per l'ordine
const ordineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  cardLast4: { type: String, required: true }, // salviamo solo ultime 4 cifre
  prodotti: [prodottoSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ordine', ordineSchema);

