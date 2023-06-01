const jwt = require('jsonwebtoken');
const RANDOM_TOKEN_SECRET = process.env.RANDOM_TOKEN_SECRET;


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        !token ? res.status(401).json({ error}) : null; // Check Token present
        const decodedToken = jwt.verify(token, RANDOM_TOKEN_SECRET);
        const userId = decodedToken.userId;
        !userId ? res.status(401).json({ error }) : null; // Verify Token validyti
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};