module.exports = function (passport) {
    var bkfd2Password = require('pbkdf2-password');
    var hasher = bkfd2Password();
    var conn = require('../config/mysql/db')();
    var router = require('express').Router();

    router.get('/', function (req, res, next) {
        if (req.user && req.user.ID) {
            if (req.user.ID === 'admin') {
                var admin = req.user.ID;
                res.render('main.html', { admin });
            }
            else {
                var id = req.user.ID;
                res.render('main.html', { id });
            }
        }
        else {
            res.render('main.html');
        }
    });

    router.get('/login', function (req, res, next) {
        res.render('login.html');
    });
    router.post('/login',
        passport.authenticate(
            'local',
            {
                successRedirect: '/',
                failureRedirect: '/auth',
                failureFlash: false
            }
        )
    );

    router.get('/register', function (req, res, next) {
        res.render('register.html')
    });
    router.post('/register', function (req, res) {
        hasher({ password: req.body.password }, function (err, pass, salt, hash) {
            var user = {
                auth_id: 'local:' + req.body.id,
                id: req.body.id,
                email: req.body.email,
                password: hash,
                salt: salt,
            };
            var sql = 'INSERT INTO users SET ?';
            conn.query(sql, user, function (err, results) {
                if (err) {
                    console.log(err);
                    res.status(500);
                }
                else {
                    res.redirect('/login');
                }
            });
        });
    });

    router.get('/logout', function (req, res) {
        req.logout(function (err) {
            if (err) {
                console.error(err);
            }
        });
        req.session.save(function () {
            res.redirect('/');
        });
    });

    router.get('/managerPage', function(req, res){
        if (req.user && req.user.ID === 'admin') {
            res.render('manage.html');
        }
        else {
            res.redirect('/');
        }
    });

    router.post('/manager/accommodation/new', function(req, res){
        var name = req.body.accommodation_name;
        var address = req.body.accommodation_address;
        var accommodation = {
            accommodation_name : name,
            address : address
        }
        var sql = 'INSERT INTO accommodation_info SET ?';
        conn.query(sql, accommodation, function (err, results) {
            if (err) {
                console.log(err);
                res.status(500);
            }
            else {
                res.redirect('/managerPage');
            }
        });
    });
    router.post('/manager/tour_spot/new', function(req, res){
        var name = req.body.spot_name;
        var address = req.body.spot_address;
        var accommodation = {
            spot_name : name,
            address : address
        }
        var sql = 'INSERT INTO tour_spots SET ?';
        conn.query(sql, accommodation, function (err, results) {
            if (err) {
                console.log(err);
                res.status(500);
            }
            else {
                res.redirect('/managerPage');
            }
        });
    });
    return router;
}