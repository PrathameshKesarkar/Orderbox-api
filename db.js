/**
 * Created by PrathamK on 6/21/2016.
 */
var Sequelize= require('sequelize');
var env = process.env.NODE_ENV|| 'development';
var sequelize;
if(env==='production') {
     sequelize = new Sequelize(process.env.DATABASE_URL,{
         'dialect': 'postgres'
     })
}
else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/data/dev-order-box-api.sqlite'
    });
}
var db ={};
db.user=sequelize.import(__dirname+'/models/user.js');
db.cust=sequelize.import(__dirname+'/models/customer.js');
db.sequelize=sequelize;
db.Sequelize=Sequelize;

module.exports=db;
