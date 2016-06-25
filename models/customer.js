/**
 * Created by PrathamK on 6/23/2016.
 */
module.exports=function (sequelize, DataType) {
    return sequelize.define('customer', {
        cust_id :{
            type:DataType.INTEGER,
            allowNull:false,
            validate:{
                isInt:true
            }
        },
        cust_Name:{
            type:DataType.STRING,
            allowNull:false
        },
        cust_Number:{
            type:DataType.INTEGER,
            allowNull:false
        }
    });
};