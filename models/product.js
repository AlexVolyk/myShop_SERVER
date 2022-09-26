const zlib = require('zlib')

const db = require('../db')
const modelDefault = require('./modelDefault')


const Product = db.define('product', {
    name: {
        ...modelDefault({})
    },
    price: {
        ...modelDefault({type: 'INTEGER'})
    },
    type: {
        ...modelDefault({type: 'ENUM'})
    },
    product_avatar: {
        ...modelDefault({allowNull: true})
    },
    description: {
        ...modelDefault({type: 'TEXT'}),
        set(value) {
            const compressed = zlib.deflateSync(value).toString('base64')
            this.setDataValue('description', compressed)
        },
        get() {
            if (this.getDataValue('description')) {
                const value = this.getDataValue('description')
                const uncompressed = zlib.inflateSync(Buffer.from(value, 'base64')).toString()
                return uncompressed
                
            }
        }
    },
    admin_id: {
        ...modelDefault({type: 'INTEGER', allowNull: true})
    }
})

module.exports = Product