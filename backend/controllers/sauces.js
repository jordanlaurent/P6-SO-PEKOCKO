const Sauce = require('../models/sauce')
const fs = require('fs');
const sauce = require('../models/sauce');


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
    const id = req.params.id;
    const user = req.body.userId;
    switch (req.body.like){
        // si like ou dislike = 0
        case 0: 
        // recherche des parametre dans sauce
        sauce.findOne({ _id: id })
        .then((sauce) =>{
            // compare si l'id de l'utilisateur est dans le tableau usersliked
            if(sauce.usersLiked.includes(user)) {
                // mise a jour de la sauce
                Sauce.update(
                { _id: id },
                // supression du likes
                {$inc: {likes: -1},
                // supression de l'id de l'utilisateur dans le tableau usersliked
                 $pull:{usersLiked: user},})
            .then(() => { res.status(201).json({ message: 'compteur like a zero!' }); })
            .catch((error) => { res.status(400).json({ error: error }); });
            } 
            
             else if (sauce.usersDisliked.includes(user)){
                Sauce.update(
                { _id: id },
                {$inc: {dislikes: -1},
                $pull: { usersDisliked: user},})
                .then(() => { res.status(201).json({ message: 'compteur dislike a zero!' }); })
                .catch((error) => { res.status(400).json({ error: error }); });
            }
        })
        // si non trouver on passe aux suivant
             break;
        // si like est egal a 1
        case  1:
            // on ajoute l'id de la sauce dans un tableau  
                Sauce.updateOne({ _id: id },{
                    // on incremente likes de 1
                $inc: {likes: 1},
                // on ajoute l'id de l'utilisateur dans le tableaux usersliked
                $push: { usersLiked: user},
                _id: id
                })
                     .then(() => { res.status(201).json({ message: 'like a été ajouté!' }); })
                     .catch((error) => { res.status(400).json({ error: error }); });
                // on passe a la suite si ce n'est pas le resultat voulue
                break;
            
            case -1:
                Sauce.updateOne({ _id: id },{
                $inc: {dislikes: 1},
                $push: { usersDisliked: user},
                _id: id
                })
                     .then(()       => { res.status(201).json({ message: 'dislike a été ajouté!' }); })
                     .catch((error) => { res.status(400).json({ error  : error }); });
                 break;
                 default: console.error('erreur !');
    }
  console.log(req.body.like);

};