const checkPassword = (req, res, next) => {
    const password = req.body.password;
    const regex = /^(?=.*[A-Z]).{7,}$/; // une majuscule et mini 8 caracteres

    if (!regex.test(password)) {
        return res.status(400).json({ error: "Le mot de passe doit contenir au moins une majuscule et être d'une longueur minimale de 8 caractères." });
    }
    next();
};

module.exports = checkPassword;