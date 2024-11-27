const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const coinsRoutes = require('./routes/coins');
const usersRoutes = require('./routes/users');
const verifyToken = require('./middlewares/auth');
const uploadRoutes = require('./routes/upload');
const multer = require('multer');

const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(multer().single('file'));


// Роуты
app.use('/api/coins', coinsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/upload', uploadRoutes);
// Применяем middleware для защищенных маршрутов
app.use('/api/admin', verifyToken);


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
