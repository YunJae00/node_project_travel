module.exports = function(passport){
    var router = require('express').Router();
    router.get('/', function(req, res, next) {
        res.render('main.html')
    });

    router.get('/login', function(req, res, next) {
        res.render('login.html')
    });
    router.get('/register', function(req, res, next) {
        res.render('register.html')
    });
    
    return router;
}