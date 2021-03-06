/**
 * Created by PrathamK on 6/21/2016.
 */
var bcrypt = require('bcryptjs');
var _ = require('underscore');
module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        salt: {
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [7, 100]
            },
            set: function (value) {
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value, salt);

                this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashedPassword);
            }
        }
    }, {
        hooks: {
            beforeValidate: function (user, options) {
                if (typeof user.email === 'string') {
                    user.email = user.email.toLowerCase();
                }
            }
        },
        classMethods: {
            authenticate: function (body) {
                return new Promise(function (resolve, reject) {
                    if (typeof body.email !== 'string' || typeof body.password !== 'string') {
                        return reject();
                    }
                    user.findOne({
                        where: {
                            email: body.email
                        }
                    }).then(function (user) {
                        if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
                            return reject();
                        }
                        resolve(user);
                    }, function (error) {
                        reject();
                    });
                });
            },
            changePassword: function (body) {
                return new Promise(function (resolve, reject) {
                    var attributes = {};
                    if (typeof body.email !== 'string' || typeof  body.password !== 'string') {

                        return reject();
                    }
                    var salt = bcrypt.genSaltSync(10);
                    var hashedPassword = bcrypt.hashSync(body.password, salt);

                    attributes.salt = salt;
                    attributes.password_hash = hashedPassword;

                    user.update(attributes, {
                        where: {
                            email: body.email
                        }
                    }).then(function (user) {
                        if (!user) {
                            return reject();
                        } else {
                            resolve(user);
                        }
                    }, function (error) {
                        reject();
                    });
                });
            }
        },
        instanceMethods: {
            toPublicJSON: function () {
                var json = this.toJSON();
                return _.pick(json, 'id', 'email', 'updatedAt', 'createdAt')
            }
        }
    });

    return user;
};