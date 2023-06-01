const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const RANDOM_TOKEN_SECRET = process.env.RANDOM_TOKEN_SECRET;
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN;
const SALT = +process.env.SALT; // operator unaire => convert to number

const User = require('../models/User');

exports.signup = (req, res, next) => {
    bcrypt.genSalt(SALT)

    .then ( salt=> {bcrypt.hash(req.body.password, salt)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ message: error.toString() }));})
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (user === null) {
                res.status(401).json( {message: 'Paire identifiant/mot de passe incorrecte'} );
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json( {message: 'Paire identifiant/mot de passe incorrecte'} );
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    RANDOM_TOKEN_SECRET,
                                    { expiresIn: TOKEN_EXPIRES_IN}
                                )
                            });
                        }
                    })
                    .catch(error => {
                        res.status(500).json({ error });
                        console.log(error);
                    });
            }
        })
        .catch(error => {
            res.status(500).json( {error} );
            console.log(error);
        });
};