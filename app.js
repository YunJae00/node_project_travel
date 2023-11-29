var app = require('./config/mysql/express')();
var passport = require('./config/mysql/passport')(app);

app.listen(3003, function(){
    console.log('connected');
});
