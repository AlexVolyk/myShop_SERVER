const jwt = require('jsonwebtoken');

const token = (obj, secret) => jwt.sign({id: obj.id}, secret, {expiresIn: 60*60*24})

module.exports = token