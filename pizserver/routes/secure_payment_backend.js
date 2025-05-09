// secure_payment_backend.js

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { check, validationResult } = require('express-validator');

const app = express();
const PORT = 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limit per evitare abusi
app.use('/checkout', rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5
}));

// Pagamento simulato (nessun dato salvato)
app.post('/checkout', [
  check('name').isLength({ min: 3 }).trim().escape(),
  check('email').isEmail().normalizeEmail(),
  check('address').notEmpty().trim().escape(),
  check('card').isLength({ min: 16, max: 16 }).isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Simulazione di elaborazione ordine
  console.log('Ordine ricevuto:', {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address
  });

  res.json({ message: 'Pagamento ricevuto. Grazie per l'ordine!' });
});

app.listen(PORT, () => {
  console.log(🛡️ Server di pagamento sicuro attivo su http://localhost:${PORT});
});