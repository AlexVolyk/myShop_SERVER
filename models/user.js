const db = require('../db')

const modelDefault = require('./modelDefault')

const { hashPassword } = require("../bcryptFunctions");
const DataType = require('sequelize');


const User = db.define('user', {
    username: {
        ...modelDefault({allowNull: true, unique: true})
    },
    firstName: {
        ...modelDefault({})
    },
    lastName: {
        ...modelDefault({})
    },
    email: {
        ...modelDefault({unique: true})
    },
    password: {
        ...modelDefault({}),
        set(value) {
            this.setDataValue('password', hashPassword(value))
        }
    },
    total_spend: {
        allowNull: false,
        type: DataType.INTEGER,
        defaultValue: 0
    },
    avatar: {
        ...modelDefault({allowNull: true})
    },
    isAdmin: {
        ...modelDefault({})
    }

});

module.exports = User