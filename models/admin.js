const db = require('../db')

const modelDefault = require('./modelDefault')

const { hashPassword } = require('../bcryptFunctions');


const Admin = db.define('admin', {
    username: {
        ...modelDefault({allowNull: true, unique: true})
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
    avatar: {
        ...modelDefault({allowNull: true})
    }
});

module.exports = Admin