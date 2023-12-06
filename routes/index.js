module.exports = function (passport) {
    var bkfd2Password = require('pbkdf2-password');
    var hasher = bkfd2Password();
    var conn = require('../config/mysql/db')();
    var router = require('express').Router();
    let request = require('request');

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

    router.get('/travel_spots', function (req, res, next) {
        if (req.user && req.user.ID) {
            if (req.user.ID === 'admin') {
                var admin = req.user.ID;
                res.render('travel_spots.html', { admin });
            }
            else {
                var id = req.user.ID;
                res.render('travel_spots.html', { id });
            }
        }
        else {
            res.render('travel_spots.html');
        }
    });

    router.get('/travel_spots/:spot_name' , function(req, res){

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

    router.get('/managerPage', function (req, res) {
        if (req.user && req.user.ID) {
            if (req.user.ID === 'admin') {
                var admin = req.user.ID;
                res.render('manage.html', { admin });
            }
            else {
                var id = req.user.ID;
                res.render('manage.html', { id });
            }
        }
        else {
            res.redirect('/');
        }
    });

    router.post('/manager/tour_spots', function (req, res) {
        var areaCode = req.body.addressKindU;
        var sigunguCode = req.body.addressKindD;
        var params = [areaCode, sigunguCode];
        var sql = 'SELECT spot_name, address FROM tour_spots WHERE areaCode = ? and sigunguCode = ?';
        conn.query(sql, params, function (err, results) {
            if (err) {
                console.log(err);
                res.status(500);
            }
            else {
                res.render('manager_spots', { results: results });
            }
        });
    });

    // router.post('/manager/accommodation/new', function (req, res) {
    //     var name = req.body.accommodation_name;
    //     var address = req.body.accommodation_address;
    //     var accommodation = {
    //         accommodation_name: name,
    //         address: address
    //     }
    //     var sql = 'INSERT INTO accommodation_info SET ?';
    //     conn.query(sql, accommodation, function (err, results) {
    //         if (err) {
    //             console.log(err);
    //             res.status(500);
    //         }
    //         else {
    //             res.redirect('/managerPage');
    //         }
    //     });
    // });
    // router.post('/manager/tour_spot/new', function (req, res) { 
    //     var name = req.body.spot_name;
    //     var address = req.body.spot_address;
    //     var accommodation = {
    //         spot_name: name,
    //         address: address
    //     }
    //     var sql = 'INSERT INTO tour_spots SET ?';
    //     conn.query(sql, accommodation, function (err, results) {
    //         if (err) {
    //             console.log(err);
    //             res.status(500);
    //         }
    //         else {
    //             res.redirect('/managerPage');
    //         }
    //     });
    // });

    router.post('/manager/tour_spot/api', function (req, res) {
        const numOfRows = 10;
        const serviceKey = 'EmMAJUdyqGktY3WZS%2FhPPMhVRG3kk%2BwCcf9cxH5nCrsW8rh%2Fr23MQwQG1MXLXkIodCWNP7gMNHvoQRSxVgIDKQ%3D%3D';
        const pageNo = '2';
        const MobileOS = 'ECT';
        const MobileApp = 'AppTest'
        const _type = 'json';
        const listYN = 'Y';
        const arrange = 'A';
        const contentTypeId = '12';
        const areaCode = req.body.addressKindU;
        const sigunguCode = req.body.addressKindD;

        let options = {
            'method': 'GET',
            'url': 'https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=' +
                serviceKey + '&numOfRows=' +
                numOfRows + '&pageNo=' +
                pageNo + '&MobileOS=' +
                MobileOS + '&MobileApp=' +
                MobileApp + '&_type=' +
                _type + '&listYN=' +
                listYN + '&arrange=' +
                arrange + '&contentTypeId=' +
                contentTypeId + '&areaCode=' +
                areaCode + '&sigunguCode=' +
                sigunguCode,
            'headers': {
                'Cookie': 'NCPVPCLB=53dc2963a8054bd57870a8b2355dc148919c5a02851f15d4ffafa945a766b4a1'
            }
        };

        request(options, async function (error, response, body) {
            if (error) {
                throw new Error(error);
            }

            let info = JSON.parse(body);

            for (let i in info['response']['body']['items']['item']) {
                let name = info['response']['body']['items']['item'][i]['title'];
                let address = info['response']['body']['items']['item'][i]['addr1'];
                let areaCode = info['response']['body']['items']['item'][i]['areacode'];
                let sigunguCode = info['response']['body']['items']['item'][i]['sigungucode'];

                try {
                    const [results] = await conn.promise().query('SELECT * FROM tour_spots WHERE spot_name = ?', [name]);

                    if (results.length === 0) {
                        await conn.promise().query('INSERT INTO tour_spots SET ?', {
                            spot_name: name,
                            address: address,
                            areaCode: areaCode,
                            sigunguCode: sigunguCode
                        });
                    }
                } catch (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
            }
            if (!res.headersSent) {
                res.redirect('/managerPage');
            }
        });
    });

    return router;
}