const jwt = require('jsonwebtoken');
const {Admin} = require('../models/index');

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


const adminValidateJWT = async (req, res, next) => {
    console.log('<<<<<<<<<<< ADMIN VALIDATION >>>>>>>>>>>>')
    console.log(req.headers.authorization);
    try {
        if (req.method == 'OPTIONS') {
            next()
    
        } else if (
            req.headers.authorization 
        ) {
            const ADMIN_SECRET = await process.env.ADMIN_SECRET

            let payload;
            
            const {authorization} = req.headers
    
            if (authorization) {

                let auth = authorization.split(' ')[1]

                payload = jwt.verify(auth, ADMIN_SECRET)

    
            } else {
                payload = undefined
    
            }

            if (payload) {
                const foundAdmin = await Admin.findOne(query(payload))
    

                if (foundAdmin) {
                    req.admin = foundAdmin
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


module.exports = adminValidateJWT