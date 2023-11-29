module.exports = function () {
    var mysql = require('mysql2');
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'rnjsdbswo00!',
        database: 'travel'
    });
    conn.connect();
    return conn;
}