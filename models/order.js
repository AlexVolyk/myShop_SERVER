const DataType = require('sequelize')
const db = require('../db')

const modelDefault = require('./modelDefault')
const User = require('./user')
const Cart = require('./cart')

const Order = db.define('order', {
    product_status: {
        type: DataType.ENUM('preparing', 'going', 'arrived'),
        allowNull: false,
        defaultValue: 'preparing'
    },
    user_id: {
        ...modelDefault({type: 'INTEGER'}),
        references: {
            model: User,
            key: 'id'
        }
    },  
    cart_id: {
        ...modelDefault({type: 'INTEGER'}),
        references: {
            model: Cart,
            key: 'id'
        }
    },
    total_sum: {
        ...modelDefault({type: 'INTEGER'})
    }
})

module.exports = Order