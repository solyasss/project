const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const router = express.Router();

// Загрузка изображения
router.post('/', (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    const uploadPath = path.join(__dirname, '../../Front/src/assets/img');

    // Создаем папку, если ее нет
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const filePath = path.join(uploadPath, file.originalname);

    fs.writeFile(filePath, file.buffer, (err) => {
        if (err) {
            console.error('Error saving file:', err);
            return res.status(500).send('Error saving file');
        }
        res.status(200).send({ fileName: file.originalname });
    });
});

// Удаление файла
router.post('/delete-image', (req, res) => {
    const { imagePath } = req.body;

    if (!imagePath) {
        return res.status(400).send('Image path is required');
    }

    const fullPath = path.join(__dirname, '../../Front', imagePath);

    fs.unlink(fullPath, (err) => {
        if (err) {
            console.error('Error deleting image:', err);
            return res.status(500).send('Error deleting image');
        }
        res.status(200).send('Image deleted successfully');
    });
});

module.exports = router;
