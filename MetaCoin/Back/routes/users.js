const express = require('express');
const { registerUser, loginUser, getAllUsers, updateUser, deleteUser, deleteAllUsers} = require('../controllers/usersController');
const router = express.Router();

router.post('/register', registerUser); // Регистрация
router.post('/login', loginUser); // Вход
router.get('/', getAllUsers); // Получение списка пользователей
router.delete('/all', deleteAllUsers); // Удаление всех пользователей
router.put('/:Id', updateUser); // Обновление пользователя
router.delete('/:Id', deleteUser); // Удаление пользователя

module.exports = router;
