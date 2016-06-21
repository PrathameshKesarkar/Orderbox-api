/**
 * Created by PrathamK on 6/21/2016.
 */
var express = require('express');
var app = express();
var PORT =process.env.PORT||3000;

app.get('/',function (req,res) {
   res.send('Order Box API Root');
});

app.listen(PORT,function () {
    console.log("Express is listening on Port"+PORT+"!");
});