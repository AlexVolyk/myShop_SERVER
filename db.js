const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.db, {
    ssl: false
})

module.exports = sequelize