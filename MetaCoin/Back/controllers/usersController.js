const db = require('../db');
const sql = require('mssql');
const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const SECRET_KEY = '3b3f12a8c6d9e7f4a2b8c71d5e9f34b1c6a9d8e7f4b2a1c9e7f6d3b2a8c1f4d'; // Замените на свой секретный ключ

// Регистрация пользователя
const registerUser = async (req, res) => {
    const { Username, DisplayName, Email, Password, ReferralId } = req.body;

    // Проверка на пустые поля
    if (!Username || !Email || !Password) {
        return res.status(400).send('Please fill in all required fields');
    }

    try {
        const hashedPassword = crypto.createHash('sha256').update(Password).digest('hex'); // Хеширование пароля
        const pool = await db;

        const result = await pool.request()
            .input('Username', sql.NVarChar(50), Username)
            .input('DisplayName', sql.NVarChar(50), DisplayName)
            .input('Email', sql.NVarChar(255), Email)
            .input('PasswordHash', sql.NVarChar(sql.MAX), hashedPassword)
            .input('Role', sql.NVarChar(20), 'User') // По умолчанию роль User
            .input('ReferralId', sql.NVarChar(50), ReferralId || null)
            .query(`
                INSERT INTO Users (Username, DisplayName, Email, PasswordHash, Role, ReferralId)
                OUTPUT INSERTED.Id, INSERTED.Username, INSERTED.DisplayName, INSERTED.Email, INSERTED.Role, INSERTED.ReferralId
                VALUES (@Username, @DisplayName, @Email, @PasswordHash, @Role, @ReferralId)
            `);

        const newUser = result.recordset[0]; // Получаем созданного пользователя
        res.status(201).json({ message: 'User registered successfully', user: newUser }); // Возвращаем данные о пользователе
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ message: 'Error registering user', error: error.message });
    }
};


// Вход пользователя
const loginUser = async (req, res) => {
    const { Email, Password } = req.body;

    try {
        const hashedPassword = crypto.createHash('sha256').update(Password).digest('hex'); // Хеширование пароля
        const pool = await db;
        const result = await pool.request()
            .input('Email', sql.NVarChar(255), Email)
            .input('PasswordHash', sql.NVarChar(sql.MAX), hashedPassword)
            .query(`
                SELECT Id, Username, DisplayName, Role, ReferralId 
                FROM Users 
                WHERE Email = @Email AND PasswordHash = @PasswordHash
            `);

        if (result.recordset.length === 0) {
            res.status(401).send('Invalid email or password');
        } else {
            const user = result.recordset[0];
            const token = jwt.sign(
                { Id: user.Id, Role: user.Role },
                SECRET_KEY,
                { expiresIn: '10m' } // Токен истекает через 10 минут
            );

            res.status(200).json({ token, user });

        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Error logging in user');
    }
};

// Обновление данных пользователя
const updateUser = async (req, res) => {
    const { Id } = req.params; // ID пользователя из параметров маршрута
    const { Username, Email, DisplayName, Role, ReferralId } = req.body;

    try {
        const pool = await db;
        const result = await pool.request()
            .input('Id', sql.Int, Id)
            .input('Username', sql.NVarChar(50), Username)
            .input('Email', sql.NVarChar(255), Email)
            .input('DisplayName', sql.NVarChar(50), DisplayName)
            .input('Role', sql.NVarChar(20), Role)
            .input('ReferralId', sql.NVarChar(50), ReferralId || null)
            .query(`
                UPDATE Users
                SET Username = @Username,
                    Email = @Email,
                    DisplayName = @DisplayName,
                    Role = @Role,
                    ReferralId = @ReferralId
                OUTPUT INSERTED.Id, INSERTED.Username, INSERTED.DisplayName, INSERTED.Email, INSERTED.Role, INSERTED.ReferralId
                WHERE Id = @Id
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        const updatedUser = result.recordset[0]; // Получаем обновленные данные
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send({ message: 'Error updating user', error: error.message });
    }
};



// Получение списка всех пользователей (для админов)
const getAllUsers = async (req, res) => {
    try {
        const pool = await db;
        const result = await pool.request().query('SELECT Id, Username, DisplayName, Email, Role, ReferralId, CreatedAt FROM Users');
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
};

// Удаление пользователя по ID
const deleteUser = async (req, res) => {
    const { Id } = req.params;

    try {
        const pool = await db;
        const result = await pool.request()
            .input('Id', sql.Int, Id)
            .query('DELETE FROM Users WHERE Id = @Id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Error deleting user', error: error.message });
    }
};

// Удаление всех пользователей
const deleteAllUsers = async (req, res) => {
    try {
        const pool = await db;
        const result = await pool.request().query('DELETE FROM Users');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send({ message: 'No users to delete' });
        }

        res.status(200).send({ message: 'All users deleted successfully' });
    } catch (error) {
        console.error('Error deleting all users:', error);
        res.status(500).send({ message: 'Error deleting all users', error: error.message });
    }
};



module.exports = { registerUser, loginUser, getAllUsers, deleteAllUsers, updateUser,deleteUser };
