// ajout du framework express  nous permettant de déployer nos API beaucoup plus rapidement
const express = require('express');
const router = express.Router();
// Pour pouvoir utiliser notre nouveau modele mongoose dans l'applucation models/sauces.js
const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// Toutes les routes des API
//router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;