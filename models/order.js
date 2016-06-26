module.exports = function (sequelize, DataTypes) {
    return sequelize.define('order', {
        order_Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        //The Id to which customer the order is related to
        cust_Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        //delivery Date
        del_Date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        //time the product is ordered
        ordered_Date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            validate: {
                isInt: true,
                len: [1, 10]
            }
        },
        //Order description
        particulars: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 1000]
            }
        },
        //The status of the product can exist in 3 state 0 - remaining to deliver : 1 - Ready to deliver : 2 - Delivered
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isInt: true,
                isIn:[[0,1,2]]
            }
        }


    });
};