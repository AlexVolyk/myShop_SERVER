const router = require('express').Router();

const { 
    User, 
    Address 
} = require('../models/index')

const { 
    registerUser, 
    loginUser,
    updateUser, 
    deleteUser,
    findUsers,
    findUser,
    findUserUser
} = require('./controllerFunctions/userFunctions/userFunctions');
const { 
    userValidateJWT,
    adminValidateJWT
} = require('../middleware/index');



//* DONE but maybe some logic are not necessary
//? LOGIN USER
router.post('/login', async(req, res) => {
    await loginUser({User, Address, req, res})
})

//* DONE but maybe some logic are not necessary
//? REGISTER USER
//!avatar upload
router.post('/register', async(req, res) => {
    // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    await registerUser({User, req, res})
})



//?--- USER VALIDATION JWT


//*DONE MAYBE
//? UPDATE USER
//!avatar upload
router.put('/update', userValidateJWT, async(req, res) => {
    await updateUser({User, req, res})
})


//* DONE but not at all >>> avatar
//! FINISH WORK WITH DELETE AVATAR ++++++++++++++++++++++++++
//? DELETE USER
router.delete('/delete', userValidateJWT, async(req, res) => {
    await deleteUser({User, req, res})
})

//? FIND USER
router.get('/user', userValidateJWT, async(req, res) => {
    await findUserUser({User, Address, req, res})
})


//?--- ADMIN VALIDATION JWT



// //? FIND USERS
router.get('/users', adminValidateJWT, async(req, res) => {
    await findUsers({User, req, res})
})

//* DONE
//? FIND USER
router.get('/:userId', adminValidateJWT, async(req, res) => {
    await findUser({User, Address, req, res})
})





module.exports = router