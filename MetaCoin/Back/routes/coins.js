const express = require('express');
const {getAllCoins, createCoin, updateCoin, deleteCoin, deleteAllCoins} = require('../controllers/coinsController');
const router = express.Router();

router.get('/', getAllCoins); // Получить все монеты
router.post('/', createCoin); // Создать новую монету
router.put('/:Id', updateCoin); // Обновить существующую монету
router.delete('/all', deleteAllCoins); // Удалить все монеты
router.delete('/:Id', deleteCoin); // Удалить монету


module.exports = router;
