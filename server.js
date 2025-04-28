const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');
require('dotenv').config();

// Import des routes
const etudiantRoutes = require('./routes/etudiants');
const livreRoutes = require('./routes/livres');
const empruntRoutes = require('./routes/empruntes');

const app = express();

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Session middleware
app.use(session({
    secret: 'votre_secret',
    resave: false,
    saveUninitialized: true
}));

// Routes API
app.use('/api/etudiants', etudiantRoutes);
app.use('/api/livres', livreRoutes);
app.use('/api/empruntes', empruntRoutes);

// Routes des vues
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/etudiants', async (req, res) => {
    try {
        const Etudiant = require('./models/etudiant');
        const etudiants = await Etudiant.find();
        res.render('etudiants', { etudiants });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

app.get('/livres', async (req, res) => {
    try {
        const Livre = require('./models/livre');
        const livres = await Livre.find();
        res.render('livres', { livres });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

app.get('/emprunts', async (req, res) => {
    try {
        const Emprunt = require('./models/emprunt');
        const Etudiant = require('./models/etudiant');
        const Livre = require('./models/livre');
        
        const emprunts = await Emprunt.find()
            .populate('etudiant')
            .populate('livre');
        const etudiants = await Etudiant.find();
        const livres = await Livre.find();
        
        res.render('emprunts', { emprunts, etudiants, livres });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

// Connexion à la base de données
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connecté à la base de données');
}).catch((err) => {
    console.error('Erreur de connexion:', err);
});

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
