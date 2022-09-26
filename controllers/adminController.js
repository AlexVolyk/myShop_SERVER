const router = require('express').Router()

const { 
    Admin,
    User
} = require('../models/index')

const { 
    loginAdmin, 
    createAdmin, 
    findAdmins, 
    findAdmin, 
    updateAdmin
} = require('./controllerFunctions/adminFunctions/adminFunctions')
const { adminValidateJWT } = require('../middleware/index');




//* DONE
router.post('/login', async(req, res) => {
    await loginAdmin({Admin, req, res})
})

//* DONE
router.post('/create', async(req, res) => {
    await createAdmin({Admin, req, res})
})

//* DONE
router.get('/admins', adminValidateJWT, async(req, res) => {
    await findAdmins({Admin, req, res})
})

//* DONE
// router.get('/:id', adminValidateJWT, async(req, res) => {
//     await findAdmin({Admin, req, res})
// })

//* DONE
router.put('/update', adminValidateJWT, async(req, res) => {
    await updateAdmin({Admin, req, res})
})



module.exports = router