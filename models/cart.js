const db = require('../db')

const modelDefault = require('./modelDefault')

const Cart = db.define('cart', {
    cart_products_ids: {
        ...modelDefault({type: 'ARRAY'})
    },
    cart_info: {
        ...modelDefault({type: 'JSON'})
    }
    // user_id: {
    //     ...modelDefault({type: 'INTEGER'})
    // }

})

module.exports = Cart