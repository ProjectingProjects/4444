const express = require('express')
var bodyParser = require('body-parser')
var userLogin = require('./routes/login');
var servicePoll = require('./routes/serviceRes');

var app = express()

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.post('/login', userLogin.login);	//call for login post

app.post('/service', servicePoll.getTables);


app.listen(3000, () => console.log('Node listening on 3000\n'))
