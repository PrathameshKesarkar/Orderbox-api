/**
 * Created by PrathamK on 6/21/2016.
 */
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db');
var bcrypt = require('bcryptjs');
var middleware = require('./middleware');
var mkdirp = require('mkdirp');
var app = express();
var PORT = process.env.PORT || 3000;
var multer = require('multer');
var fs = require('fs');
var basePath = './public/databases';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./public/databases');
    },
    filename: function (req, file, cb) {

        var getFileExt = function (filename) {
            var fileExt= filename.split('.');
            if(fileExt.length===1||fileExt[0]===''){
                return"";
            }
            return fileExt.pop();
        };

        cb(null,Date.now()+'.'+getFileExt(file.originalname));
    }
});


app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Order Box API Root');
});

app.post('/users', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');

    db.user.create(body).then(function (user) {
        var dir = basePath + '/' + user.id.toString();
        mkdirp(dir, function (error) {
            if (error) {
                console.error(error);
            }
            else {
                console.log('pow');
            }
        });
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


app.post('/database', multer({storage:storage}).single('upl'), function (req, res) {
    console.log(req.file);
    res.status(204).send();
});

app.get('/database',function (req, res) {
    //res.send(path.join(__dirname,'/public/database','1467287165514.png'));
    var file = fs.readFileSync('./public/databases/1467287165514.png');
    res.writeHead(200,{'Content-Type':'image/png'});
    res.end(file);
});

db.sequelize.sync({force: true}).then(function () {
    app.listen(PORT, function () {
        console.log("Express is listening on Port " + PORT + "!");
    });
});

