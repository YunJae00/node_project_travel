module.exports = function(passport){
    var router = require('express').Router();
    router.get('/', function(req, res, next) {
        res.render('index.html')
    });

    return router;
}