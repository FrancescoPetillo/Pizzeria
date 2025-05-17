console.log('BODY:', req.body);
const Order = require('../models/order');
const Product = require('../models/product');

// Funzione per creare un ordine
const createOrder = async (req, res) => {
  const { name, email, address, productId, card } = req.body;

  try {
    // Trova il prodotto
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({ message: 'Product not found!' });
    }

    const totalAmount = product.price; // Assicurati che il campo sia 'prezzo' in Prodotto
    const cardLast4 = card ? card.slice(-4) : ''; // Ultime 4 cifre della carta

    // Crea nuovo ordine
    const order = new Order({
      userId: req.user ? req.user._id : undefined, // undefined is fine if not authenticated
      name,
      email,
      address,
      products: [{
        productId: product._id,
        quantity: 1
      }],
      totalAmount,
      paymentMethod: 'simulated',
      status: 'pending',
      cardLast4
    });

    await order.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

module.exports = { createOrder };
