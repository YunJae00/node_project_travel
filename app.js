var app = require('./config/mysql/express')();
var passport = require('./config/mysql/passport')(app);
var router = require('./routes/index')(passport);
app.use('/', router);

app.listen(3003, function () {
    console.log('connected');
});
