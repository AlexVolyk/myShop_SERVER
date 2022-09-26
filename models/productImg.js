const db = require('../db')

const modelDefault = require('./modelDefault')

const ProductImg = db.define('product_img', {
    name: {
        ...modelDefault({})
    },
    url: {
        ...modelDefault({})
    },
    product_id: {
        ...modelDefault({type: 'INTEGER', allowNull: true})
    }
})

module.exports = ProductImg