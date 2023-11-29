module.exports = function (app) {
    var conn = require('./db')();
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var bkfd2Password = require('pbkdf2-password');
    var hasher = bkfd2Password();

    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser(function (user, done) {
        done(null, user.authId);
    });
    passport.deserializeUser(function (id, done) {
        var sql = 'SELECT * FROM users';
        conn.query(sql, function (err, results) {
            for (var i = 0; i < results.length; i++) {
                var user = results[i];
                if (user.authId === id) {
                    return done(null, user);
                }
            }
            done('there is no user.');
        });
    });
    passport.use(new LocalStrategy(
        function (username, password, done) {
            var uname = username;
            var pwd = password;
            var sql = 'SELECT * FROM users WHERE user_name = ?';
            conn.query(sql, [uname], function (err, results) {
                for (var i = 0; i < results.length; i++) {
                    var user = results[i];
                    if (uname === user.user_name) {
                        return hasher({ password: pwd, salt: user.salt }, function (err, pass, salt, hash) {
                            if (hash === user.password) {
                                done(null, user);
                            } else {
                                done(null, false);
                            }
                        });
                    }
                }
                done(null, false);
            });
        }
    ));
    return passport;
}