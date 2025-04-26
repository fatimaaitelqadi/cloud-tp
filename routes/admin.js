const express = require('express');
const router = express.Router();
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);


// Route de login admin
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'Admin' && password === 'Admin') {
    return res.status(200).json({ message: 'Connexion réussie' });
  } else {
    return res.status(401).json({ message: 'Nom d utilisateur ou mot de passe incorrect' });
  }
});

module.exports = router;
