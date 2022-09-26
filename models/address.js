const db = require('../db')

const modelDefault = require('./modelDefault')

const Address = db.define('address', {
    country: {
        ...modelDefault({})
    },
    city: {
        ...modelDefault({})
    },
    post_office: {
        ...modelDefault({type:'INTEGER'})
    },
    user_id: {
        ...modelDefault({type: 'INTEGER', allowNull: true})
    }
    //user_id by relations
})

module.exports = Address