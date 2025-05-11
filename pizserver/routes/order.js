const Order = require('../models/order');
const Product = require('../models/product');  // Assumendo che tu abbia un modello per i prodotti

// Funzione per creare un ordine
const createOrder = async (req, res) => {
  const { name, email, address, productId, card } = req.body;

  try {
    // Trova il prodotto dal database
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({ message: 'Prodotto non trovato!' });
    }

    // Calcola il totale dell'ordine (qui per semplicità lo facciamo come prezzo del prodotto)
    const totalAmount = product.price;

    // Crea un nuovo ordine
    const order = new Order({
      userId: req.user._id,  // Assumendo che l'utente sia autenticato
      products: [{
        productId: product._id,
        quantity: 1
      }],
      totalAmount: totalAmount,
      paymentMethod: 'simulato',
      status: 'pending'
    });

    // Salva l'ordine nel database
    await order.save();
    
    // Restituisci una risposta positiva
    res.status(201).json({ message: 'Ordine creato con successo', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore nella creazione dell\'ordine' });
  }
};

module.exports = { createOrder };
