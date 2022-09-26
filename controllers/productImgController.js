const router = require('express').Router()

const { 
    ProductImg, 
    Product 
} = require('../models/index')
    
const { createProductImg } = require('./controllerFunctions/productImgFunctions/productImgFunctions')
const { adminValidateJWT } = require('../middleware/index');


//* DONE
//? ADMIN JWT VALIDATION
router.post('/create/:productId', adminValidateJWT, async(req, res) => {
    await createProductImg({ProductImg, Product, req, res})
})


module.exports = router