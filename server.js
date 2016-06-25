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


app.post('/customer', function (req, res) {
    var body = _.pick(req.body, 'cust_id', 'cust_Name', 'cust_Number');

    db.cust.create(body).then(function (customer) {
        res.json(customer.toJSON())
    }, function (error) {
        res.status(400).json(error);
    });
});

app.post('/customers',function (req, res) {
    var body = _.map(req.body,function (singleCustomer) {
       return _.pick(singleCustomer,'cust_id','cust_Name','cust_Number');
    });
    db.cust.bulkCreate(body).then(function (customers) {
        res.json(customers);
    },function (error) {
        res.status(500).send();
    })

});

app.get('/customer/:id', function (req, res) {
    var custId = parseInt(req.params.id, 10);

    db.cust.findById(custId).then(function (customer) {
        if (!!customer) {
            res.json(customer.toJSON())
        }
        else {
            res.status(404).send();
        }
    }, function (error) {
        res.status(500).send();
    });
});

app.get('/customers',function (req, res) {
    var query = req.query;
    var where ={};
    db.cust.findAll({where:where}).then(function (customers) {
        res.json(customers);
    },function (error) {
        res.status(500).send();
    });
});


app.post('/users/login', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');

    db.user.authenticate(body).then(function (user) {
        res.json(user.toPublicJSON());
    }, function (error) {
        res.status(401).send('Password or email maybe wrong');
    });


});

db.sequelize.sync({force: true}).then(function () {
    app.listen(PORT, function () {
        console.log("Express is listening on Port " + PORT + "!");
    });
});

