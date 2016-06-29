/**
 * Created by PrathamK on 6/21/2016.
 */
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db');
var bcrypt = require('bcryptjs');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Order Box API Root');
});

app.post('/users', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');

    db.user.create(body).then(function (user) {
        res.json(user.toPublicJSON());
    }, function (error) {
        res.status(400).json(error);
    });
});

app.post('/users/login', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');

    db.user.authenticate(body).then(function (user) {
        var token = user.generateToken('authentication');
        if (token)
            res.header('Auth', token).json(user.toPublicJSON());
        else
            res.status(401).send();
    }, function (error) {
        res.status(401).send('Password or email maybe wrong');
    });


});

db.sequelize.sync({force: true}).then(function () {
    app.listen(PORT, function () {
        console.log("Express is listening on Port " + PORT + "!");
    });
});

