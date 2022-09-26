const router = require('express').Router()


const { Address } = require('../models/index')

const { 
    // findAddress, 
    createAddress, 
    updateAddress 
} = require('./controllerFunctions/addressFunctions/addressFunctions')
const { userValidateJWT } = require('../middleware/index')

// // //* DONE
// router.get('/:addressId', userValidateJWT, async(req, res) => {
//     await findAddress({Address, req, res})
// })

//* DONE
router.post('/create', userValidateJWT, async(req, res) => {
    await createAddress({Address, req, res})
})

//* DONE
router.put('/update',  userValidateJWT, async(req, res) => {
    await updateAddress({Address, req, res})
})


module.exports = router