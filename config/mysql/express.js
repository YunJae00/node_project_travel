module.exports = function () {
    var express = require('express');
    var bodyPaser = require('body-parser');
    var session = require('express-session');
    var MySQLStore = require('express-mysql-session')(session);

    var app = express();
    app.use(bodyPaser.urlencoded({ extended: false }));
    app.use(session({
        secret: 'sdfsdf#$',
        resave: false,
        saveUninitialized: true,
        store: new MySQLStore({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'rnjsdbswo00!',
            database: 'travel'
        })
    }));
    return app;
}