// ajout du framework express  nous permettant de déployer nos API beaucoup plus rapidement
const express = require('express');
//pour gerer la demande post provenant de l'application front end
const bodyParser = require('body-parser');
const path = require('path');
// integrons la couche de base de donné de notre serveur mongodg
const mongoose = require('mongoose');

const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://jordanL:Jojodu45@thehottestreviews.jiytn.mongodb.net/thehottestreviews?retryWrites=true&w=majority', {
        useUnifiedTopology: true
    }, { useNewUrlParser: true })
    .then(() => console.log('connexion a MongoDB réussie!'))
    .catch(() => console.log('connexion a MongoDB echoue!'));


// Création de l'application express
const app = express();

//Erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Rend les données du corps de la requête exploitable
app.use(bodyParser.json());

// Routes attendues pour les differentes API
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;