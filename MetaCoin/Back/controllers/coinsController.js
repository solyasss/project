const db = require('../db');
const sql = require('mssql');

// Получение всех данных монет
const getAllCoins = async (req, res) => {
    try {
        const pool = await db;
        const result = await pool.request().query('SELECT * FROM Coins');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching coins');
    }
};

// Создание новой монеты
// const createCoin = async (req, res) => {
//     const { Name, Symbol, Price, PriceChange24H, PriceChange7D, ImagePath } = req.body;
//     try {
//         const pool = await db;
//         await pool.request()
//             .input('Name', sql.NVarChar(50), Name)
//             .input('Symbol', sql.NVarChar(10), Symbol)
//             .input('Price', sql.Decimal(18, 4), Price)
//             .input('PriceChange24H', sql.Float, PriceChange24H)
//             .input('PriceChange7D', sql.Float, PriceChange7D)
//             .input('ImagePath', sql.NVarChar(255), ImagePath)
//             .query(`
//                 INSERT INTO Coins
//                 (Name, Symbol, Price, PriceChange24H, PriceChange7D, ImagePath)
//                 VALUES (@Name, @Symbol, @Price, @PriceChange24H, @PriceChange7D, @ImagePath)
//             `);
//         res.status(201).send('Coin created');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error creating coin');
//     }
// };

const createCoin = async (req, res) => {
    const coins = req.body; // Ожидаем массив монет
    if (!Array.isArray(coins) || coins.length === 0) {
        return res.status(400).send('Invalid request: Expected an array of coins');
    }

    const pool = await db; // Получаем соединение к БД
    const successfulInserts = [];
    const failedInserts = [];

    for (const coin of coins) {
        const {Name, Symbol, Price, PriceChange24H, PriceChange7D, ImagePath} = coin;

        // Проверка на обязательные поля
        if (!Name || !Symbol || !Price) {
            failedInserts.push({coin, error: 'Missing required fields'});
            continue;
        }

        try {
            await pool.request()
                .input('Name', sql.NVarChar(50), Name)
                .input('Symbol', sql.NVarChar(10), Symbol)
                .input('Price', sql.Decimal(18, 4), Price)
                .input('PriceChange24H', sql.Float, PriceChange24H || 0)
                .input('PriceChange7D', sql.Float, PriceChange7D || 0)
                .input('ImagePath', sql.NVarChar(255), ImagePath || null)
                .query(`
                    INSERT INTO Coins 
                    (Name, Symbol, Price, PriceChange24H, PriceChange7D, ImagePath)
                    VALUES (@Name, @Symbol, @Price, @PriceChange24H, @PriceChange7D, @ImagePath)
                `);

            successfulInserts.push(coin); // Успешно добавленные монеты
        } catch (error) {
            failedInserts.push({coin, error: error.message}); // Ошибка для этой конкретной монеты
        }
    }

    // Возвращаем результат
    if (failedInserts.length === 0) {
        res.status(201).send({message: 'All coins added successfully', successfulInserts});
    } else {
        res.status(207).send({
            message: 'Some coins were not added',
            successfulInserts,
            failedInserts,
        });
    }
};


// Редактирование монеты
const updateCoin = async (req, res) => {
    const {Id} = req.params; // Получаем ID из параметров маршрута
    const {Name, Symbol, Price, PriceChange24H, PriceChange7D, ImagePath} = req.body;

    try {
        const pool = await db;
        await pool.request()
            .input('Id', sql.Int, Id)
            .input('Name', sql.NVarChar(50), Name)
            .input('Symbol', sql.NVarChar(10), Symbol)
            .input('Price', sql.Decimal(18, 4), Price)
            .input('PriceChange24H', sql.Float, PriceChange24H)
            .input('PriceChange7D', sql.Float, PriceChange7D)
            .input('ImagePath', sql.NVarChar(255), ImagePath)
            .query(`
                UPDATE Coins 
                SET Name = @Name, 
                    Symbol = @Symbol, 
                    Price = @Price, 
                    PriceChange24H = @PriceChange24H, 
                    PriceChange7D = @PriceChange7D, 
                    ImagePath = @ImagePath 
                WHERE Id = @Id
            `);
        // Возвращаем JSON-ответ вместо текста
        res.status(200).json({ message: 'Coin updated successfully', updatedCoin: { Id, Name, Symbol, Price, PriceChange24H, PriceChange7D, ImagePath } });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating coin');
    }
};

// Удаление монеты
const deleteCoin = async (req, res) => {
    const {Id} = req.params; // Получаем ID из параметров маршрута

    try {
        const pool = await db;
        const result = await pool.request()
            .input('Id', sql.Int, Id)
            .query('DELETE FROM Coins WHERE Id = @Id');

        // Проверяем, сколько строк было затронуто
        if (result.rowsAffected[0] === 0) {
            return res.status(404).send({message: 'Coin not found'});
        }

        res.status(200).send({message: 'Coin deleted successfully'});
    } catch (error) {
        console.error('Error deleting coin:', error);
        res.status(500).send({message: 'Error deleting coin', error: error.message});
    }
};

// Удаление всех монет
const deleteAllCoins = async (req, res) => {
    try {
        const pool = await db;
        const result = await pool.request().query('DELETE FROM Coins');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send({message: 'No coins to delete'});
        }

        res.status(200).send({message: 'All coins deleted successfully'});
    } catch (error) {
        console.error('Error deleting all coins:', error);
        res.status(500).send({message: 'Error deleting all coins', error: error.message});
    }
};


module.exports = {getAllCoins, createCoin, updateCoin, deleteCoin, deleteAllCoins};
