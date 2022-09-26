const jwt = require('jsonwebtoken');
const {User} = require('../models/index');

const query = (payload) => (
    {
        where: {
            id: payload.id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    }
)


const userValidateJWT = async (req, res, next) => {
    console.log('<<<<<<<<<<< USER VALIDATION >>>>>>>>>>>>')
    // console.log(req.headers);
    try {
        if (req.method == 'OPTIONS') {
            next()
    
        } else if (
            req.headers.authorization 
        ) {
            const USER_SECRET = await process.env.USER_SECRET
            let payload;

            const {authorization} = req.headers
            
    
            if (authorization) {

                let auth = authorization.split(' ')[1]

                payload = jwt.verify(auth, USER_SECRET)

    
            } else {
                payload = undefined
    
            }

            if (payload) {
                const foundUser = await User.findOne(query(payload))

    
                if (foundUser) {
                    req.user = foundUser
                    next()
    
                } else {
                    res.status(400).send({
                        message: "Not Authorized"
                    })
    
                }
    
            } else {
                res.status(401).json({
                    message: 'Invalid token'
                })
    
            }
    
        } else {
            res.status(403).json({
                message: "Forbidden"
            })
    
        }
        
    } catch (e) {
        res.status(500).json({
            message: 'Token authorization faild',
            error: e.message
        })

    }

}


module.exports = userValidateJWT