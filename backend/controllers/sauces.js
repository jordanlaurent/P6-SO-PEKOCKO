const Sauce = require('../models/sauce')
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    //delete thingObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};
// like ou dislike sauce
exports.likeSauce = (req, res, next) => {
    const sauce = JSON.parse(req.body.sauce);
    console.log(sauce);
    // mise a jour du contenue de  Sauce 
    Sauce.updateOne({ _id: req.params.id })
        // si les deux opérandes ne sont pas égaux alors 
    if (like != -1) {
        // creation d'une nouvelle sauce avec 
        const Sauce = new Sauces({
            userId: sauce.userId,
            likes: likes++,
            dislikes: dislikes--,
            usersLiked: usersLiked.push(userId),
        });
        Sauce.save()
            .then(() => res.status(201).json({ message: 'J aime enregistrer!' }))
            .catch(error => res.status(400).json({ error }));
    } else {
        const Sauce = new Sauces({
            userId: sauce.userId,
            likes: likes++,
            dislikes: dislikes--,
            usersLiked: usersLiked.push(userId),
        });
        Sauce.save()
            .then(() => res.status(201).json({ message: 'J aime pas enregistrer!' }))
            .catch(error => res.status(400).json({ error }));
    }

};