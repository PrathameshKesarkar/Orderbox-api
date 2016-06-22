/**
 * Created by PrathamK on 6/21/2016.
 */
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db');


var app = express();
var PORT =process.env.PORT||3000;

app.use(bodyParser.json());

app.get('/',function (req,res) {
   res.send('Order Box API Root');
});

app.post('/users',function (req, res) {
    var body = _.pick(req.body,'email','password');

    db.user.create(body).then(function (user) {
        res.json(user.toJSON());
    },function (error) {
        res.status(400).json(error);
    });
});

db.sequelize.sync().then(function () {
    app.listen(PORT,function () {
        console.log("Express is listening on Port"+PORT+"!");
    });    
});

