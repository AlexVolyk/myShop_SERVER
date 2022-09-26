const bcryptjs = require('bcryptjs');


const comparePassword = ({notEncrypted, encrypted}) => bcryptjs.compare(notEncrypted, encrypted)
const hashPassword = (notEncrypted) => bcryptjs.hashSync(notEncrypted, 13)

module.exports = {
    comparePassword,
    hashPassword
}