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


app.post('/customer', function (req, res) {
    var body = _.pick(req.body, 'cust_id', 'cust_Name', 'cust_Number');

    db.cust.create(body).then(function (customer) {
        res.json(customer.toJSON())
    }, function (error) {
        res.status(400).json(error);
    });
});

//Bulk Insert for customer
app.post('/customers', function (req, res) {
    var body = _.map(req.body, function (singleCustomer) {
        return _.pick(singleCustomer, 'cust_id', 'cust_Name', 'cust_Number');
    });
    db.cust.bulkCreate(body).then(function (customers) {
        res.json(customers);
    }, function (error) {
        res.status(500).send();
    });

});

//Update Customer details
app.put('/customer/:id', function (req, res) {
    var custId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'cust_id', 'cust_Name', 'cust_Number');
    var attributes = {};
    if (body.hasOwnProperty('cust_id')) {
        attributes.cust_id = body.cust_id;
    }
    if (body.hasOwnProperty('cust_Name')) {
        attributes.cust_Name = body.cust_Name;
    }
    if (body.hasOwnProperty('cust_Number')) {
        attributes.cust_Number = body.cust_Number;
    }
    db.cust.update(attributes, {
        where: {
            cust_id: custId
        }
    }).then(function (customer) {
        if (customer)
            res.json(customer);
        else
            res.status(404).send();
    }, function (error) {
        res.status(500).json(error);
    });
});
//Bulk Create Orders
app.post('/orders', function (req, res) {
    var body = _.map(req.body, function (singleOrder) {
        return _.pick(singleOrder, 'order_Id', 'cust_Id', 'del_Date', 'ordered_Date', 'amount', 'particulars', 'status');
    });
    db.order.bulkCreate(body).then(function (orders) {
        res.json(orders)
    }, function (error) {
        res.status(500).json(error);
    });

});


app.post('/order', function (req, res) {
    var body = _.pick(req.body, 'order_Id', 'cust_Id', 'del_Date', 'ordered_Date', 'amount', 'particulars', 'status');

    db.order.create(body).then(function (order) {
        res.json(order.toJSON());
    }, function (error) {
        res.status(400).json(error);
    });
});


app.put('/order/:id', function (req, res) {
    var orderId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'order_Id', 'cust_Id', 'del_Date', 'ordered_Date', 'amount', 'particulars', 'status');
    var attributes = {};

    //Check if the properties exist
    if (body.hasOwnProperty('order_Id')) {
        attributes.order_Id = body.order_Id;
    }

    if (body.hasOwnProperty('cust_Id')) {
        attributes.cust_id = body.cust_id;
    }
    if (body.hasOwnProperty('del_Date')) {
        attributes.del_Date = body.del_Date;
    }

    if (body.hasOwnProperty('ordered_Date')) {
        attributes.ordered_Date = body.ordered_Date;
    }

    if (body.hasOwnProperty('amount')) {
        attributes.amount = body.amount;
    }

    if (body.hasOwnProperty('particulars')) {

        attributes.particulars = body.particulars;
    }

    if (body.hasOwnProperty('status')) {

        attributes.status = body.status;
    }
    //update the specific values
    db.order.update(attributes, {
        where: {
            order_Id: orderId
        }
    }).then(function (order) {
        if (order) {
            res.json(order.toJSON)
        } else {
            res.status(404).send();
        }
    }, function (error) {
        res.status(400).json(error);
    })
});


app.get('/orders', function (req, res) {
    var where = {};
    db.order.findAll({where: where}).then(function (orders) {
        res.json(orders);
    }, function (error) {
        res.status(400).json(error);
    });
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

app.get('/customers', function (req, res) {
    var where = {};
    db.cust.findAll({where: where}).then(function (customers) {
        res.json(customers);
    }, function (error) {
        res.status(400).send();
    });
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
        res.json(user.toPublicJSON());
    }, function (error) {
        res.status(401).send();
    });


});
app.post('/users/change_pass', function (req, res) {
    var body = _.pick(req.body, 'email', 'password');

    db.user.changePassword(body).then(function (user) {
        res.json(user);
    }, function (error) {
        res.status(401).send();
    })
});

db.sequelize.sync({force: true}).then(function () {
    app.listen(PORT, function () {
        console.log("Express is listening on Port " + PORT + "!");
    });
});

