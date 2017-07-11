'use strict';

const Sequelize = require('sequelize');
const sequelize = new Sequelize('holiday-extra', null, null, {
    dialect: 'sqlite',
    storage: 'db.sqlite',
    logging: false
});

const User = sequelize.define('user', {
    email: {
        type: Sequelize.STRING(200),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Email field is invalid'
            }
        }
    },
    forename: {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: {
            isAlpha: {
                msg: 'Forename can only contain letters'
            }
        },
    },
    surname: {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: {
            isAlpha: {
                msg: 'Surname can only contain letters'
            }
        },
    },
}, {
    indexes: [{
        unique: true,
        fields: ['email']
    }],
    timestamps: true,
    updatedAt: false,
    createdAt: 'created'
});

module.exports = {
    sequelize,
    User
};
