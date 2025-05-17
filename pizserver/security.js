// Sicurezza HTTP e rate limiting per Express
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

module.exports = function(app) {
  // Protezione HTTP headers
  app.use(helmet());

  // Limite richieste API (100 richieste ogni 15 minuti per IP)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);
};
