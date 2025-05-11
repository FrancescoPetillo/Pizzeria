// src/models/pizza.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pizzaSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  ingredients: [{ id: String, name: String }],
  topping: [{ id: String, name: String, price: Number }],
  image: { type: String },  // URL o nome dell'immagine
});

module.exports = mongoose.model('Pizza', pizzaSchema);
