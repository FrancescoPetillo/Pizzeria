// secure_payment_backend.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { check, validationResult, sanitizeBody } = require('express-validator');

const app = express();
const PORT = 3000;

// Middleware di sicurezza
app.use(helmet());
app.use(cors());
app.use(express.json());

// Limita le richieste per evitare abusi (5 al minuto per /checkout)
app.use('/checkout', rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5
}));

// Rotta di pagamento simulato
app.post('/checkout', [
  check('name').isLength({ min: 3 }).trim().escape().toLowerCase(),
  check('email').isEmail().normalizeEmail().trim(),
  check('address').notEmpty().trim().escape(),
  check('card').isLength({ min: 16, max: 16 }).isNumeric().trim(),

  // Sanitizzazione dei campi
  sanitizeBody('name').escape(),
  sanitizeBody('email').normalizeEmail(),
  sanitizeBody('address').escape(),
  sanitizeBody('card').escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Simulazione: stampa ordine in console (senza salvare la carta)
  console.log('🧾 Ordine ricevuto:', {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address
  });

  res.json({ message: "Pagamento ricevuto. Grazie per l'ordine!" });
});

// Avvio server
app.listen(PORT, () => {
  console.log(`🛡️ Server di pagamento sicuro attivo su http://localhost:${PORT}`);
});
