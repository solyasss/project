const jwt = require('jsonwebtoken');
const SECRET_KEY = '3b3f12a8c6d9e7f4a2b8c71d5e9f34b1c6a9d8e7f4b2a1c9e7f6d3b2a8c1f4d'; // Тот же секретный ключ, что и в loginUser

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).send('Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Добавляем расшифрованные данные пользователя в запрос
        next();
    } catch (err) {
        res.status(403).send('Invalid or expired token.');
    }
};

module.exports = verifyToken;
