module.exports = function () {
    var express = require('express');
    var bodyPaser = require('body-parser');
    var session = require('express-session');
    var MySQLStore = require('express-mysql-session')(session);
    var nunjucks = require('nunjucks');

    var app = express();
    app.set('view engine', 'html');
    nunjucks.configure('./views', {
        express: app
    });
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