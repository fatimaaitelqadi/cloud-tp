const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import des routes
const etudiantRoutes = require('./routes/etudiants');
const livreRoutes = require('./routes/livres');
const empruntRoutes = require('./routes/empruntes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Pour analyser les données JSON

// Routes API
app.use('/api/etudiants', etudiantRoutes);
app.use('/api/livres', livreRoutes);
app.use('/api/empruntes', empruntRoutes);

// Servir les fichiers statiques du dossier "public"
app.use(express.static(path.join(__dirname, 'public')));

// Pour toutes les autres routes, servir index.html (SPA ou fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connecté à la base de données');
}).catch((err) => {
  console.error('❌ Erreur de connexion à la base de données:', err);
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
