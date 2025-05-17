// secure_payment_backend.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { check, validationResult } = require('express-validator');

const app = express();
const PORT = 3000;

// Middleware di sicurezza
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limit
app.use('/checkout', rateLimit({
  windowMs: 60 * 1000,
  max: 5
}));

// Rotta di pagamento sicura
app.post('/checkout', [
  check('name').isLength({ min: 3 }).trim().escape(),
  check('email').isEmail().normalizeEmail().trim(),
  check('address').notEmpty().trim().escape(),
  check('card').isLength({ min: 16, max: 16 }).isNumeric().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Risposta sempre con message + dettagli errori
    return res.status(400).json({ 
      message: 'Dati non validi',
      errors: errors.array()
    });
  }

  // Logga solo ultime 4 cifre della carta e l’IP
  const safeCard = req.body.card.replace(/\d{12}(\d{4})/, '************$1');
  console.log('🧾 Ordine ricevuto:', {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    card: safeCard,
    ip: req.ip
  });

  res.json({ message: "Pagamento ricevuto. Grazie per l'ordine!" });
});

// Avvio server
app.listen(PORT, () => {
  console.log(`🛡️ Server di pagamento sicuro attivo su http://localhost:${PORT}`);
});
