const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Middleware per rotte protette
function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Non autenticato' });
  next();
}

// REGISTRAZIONE
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (await User.findOne({ email })) {
      // Risposta chiara per Angular
      return res.status(400).json({ message: 'Email già registrata' });
    }
    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });
    //req.session.userId = user._id;
    // Risposta JSON per Angular
    res.status(200).json({ message: 'Registrazione avvenuta!' });
  } catch (err) {
    res.status(500).json({ message: 'Errore durante la registrazione' });
  }
});

// LOGIN
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Credenziali errate' });
    }
    req.session.userId = user._id;
    res.status(200).json({ message: 'Login effettuato!' });
  } catch (err) {
    res.status(500).json({ message: 'Errore durante il login' });
  }
});

// LOGOUT
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// PROFILO
router.get('/profile', requireAuth, async (req, res) => {
  const user = await User.findById(req.session.userId).select('-password');
  res.render('profile', { user });
});

router.post('/profile', requireAuth, async (req, res) => {
  const { name } = req.body;
  await User.findByIdAndUpdate(req.session.userId, { name });
  res.redirect('/auth/profile');
});

// RECUPERO PASSWORD - richiesta email
router.get('/forgot', (req, res) => {
  res.render('forgot');
});

router.post('/forgot', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.render('forgot', { error: 'Email non trovata' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  // Configura qui i dati del tuo provider email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'franvittore1926@gmail.com', pass: 'Franvittore1926.' }
  });

  const resetLink = `http://localhost:3000/auth/reset/${token}`;
  await transporter.sendMail({
    to: user.email,
    subject: 'Recupero password',
    text: `Clicca qui per reimpostare la password: ${resetLink}`
  });

  res.render('forgot', { message: 'Email inviata! Controlla la posta.' });
});

// RECUPERO PASSWORD - reset effettivo
router.get('/reset/:token', async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) return res.render('forgot', { error: 'Token non valido o scaduto' });
  res.render('reset', { token: req.params.token });
});

router.post('/reset/:token', async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) return res.render('forgot', { error: 'Token non valido o scaduto' });

  // Hash nuova password
  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.redirect('/auth/login');
});

module.exports = router;