const sql = require('mssql');

// Конфигурация для базы данных
const config = {
    user: 'admin',   				 // пользователь базы данных
    password: '22222',	 			 // пароль пользователя
    server: 'DESKTOP-78M1QI9\\SQLEXPRESS',	 // хост
    database: 'MetaCoin',  	         // имя бд
    port: 1433,			 			 // порт, на котором запущен sql server
    options: {
        encrypt: true,               // Использование SSL/TLS
        trustServerCertificate: true // Отключение проверки самоподписанного сертификата
    },
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to the database');
        return pool;
    })
    .catch(err => console.error('Database connection failed: ', err));

module.exports = poolPromise;
