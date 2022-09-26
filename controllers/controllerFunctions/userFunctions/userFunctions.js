const {Op} = require('sequelize');

const token = require('../../../createToken')
const { comparePassword } = require('../../../bcryptFunctions')
const { 
    imgDownload, 
    imgDelete 
    } = require('../../../imageFunctions/imageFunctions');
const { USER_AVATAR } = require('../../../directories');
const { 
    personLoginExists,
    personLoginValidation,
    personRegisterValidation,
    findEmail,
    findUsername
} = require('../personDataValidation');
const { Address } = require('../../../models');

const exclude = ['createdAt', 'updatedAt']
const orderDESCid = ['id', 'DESC']

//* DONE
//?--- ADMIN VALIDATION JWT
async function findUsers({User, Address, req, res}) {

    try {
        let query = {
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            },
            order: [
                orderDESCid
            ]
        }
        

        if (req.query.firstName) {
            const inFirstName = await req.query.firstName
            
            query.where = {
                firstName: {
                    [Op.substring]: inFirstName
                }
            }

        }
        

        const users = await User.findAll({
            ...query,
            include: Address
        })

        if (users.length) {
            await res.status(200).json({
                users
            })
            
        } else {
            await res.status(404).json({
                message: 'Not found users'
            })

        }


    } catch (e) {
        res.status(500).json({
            message: "Faild to find users",
            error: e.message
        })

    }

}

//* DONE
//?--- ADMIN VALIDATION JWT
async function findUser({User, Address, req, res}) {
    try {
        const query = {
            where: {
                id: req.params.userId
            }
        }


        const isUser = await User.findOne({
                ...query,
            include: { 
                model: Address,

                attributes: {
                    exclude
                }
            },
            attributes: {
                exclude: ['id', 'password', 'createdAt', 'updatedAt']
            }
        })

    
        if (isUser){
            res.status(200).json({
                user: isUser
            })

        } else {
            res.status(404).json({
                message: 'User not found'
            })

        }

    } catch (e) {
        res.status(500).json({
            message: "Faild to find user",
            error: e.message
        })

    }

}

async function findUserUser({User, Address, req, res}) {
    try {
        const query = {
            where: {
                id: req.user.id
            }
        }


        const isUser = await User.findOne({
                ...query,
            // include: { 
            //     model: Address,

            //     attributes: {
            //         exclude
            //     }
            // },
            attributes: {
                exclude: ['id', 'password', 'createdAt', 'updatedAt']
            }
        })

    
        if (isUser){
            res.status(200).json({
                user: isUser
            })

        } else {
            res.status(404).json({
                message: 'User not found'
            })

        }

    } catch (e) {
        res.status(500).json({
            message: "Faild to find user",
            error: e.message
        })

    }

}



//* DONE but maybe some logic are not necessary
async function loginUser({User, Address, req, res}) {

    try {
    
        // const loginData = await req.body.user
        const loginData = await req.body

        // console.log(loginData, '+++++++++++=');

        // console.log(loginData);
        const loginQuery = {
            where: {
                email: loginData.email,
                // password: loginData.password
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }

        if (!loginData.email || !loginData.password) {

            await personLoginValidation({loginData, res})

        } else {
            const user = await User.findOne({
                ...loginQuery,
                include: {
                    model: Address,
                    // required: true
                }
            })
    
            if (user) {
                const notEncrypted = await loginData.password
                const encrypted = await user.password

                const isComparedPassword = await comparePassword({notEncrypted, encrypted})
            
                if (isComparedPassword) {
                    const userSessionToken = await token(user, process.env.USER_SECRET)
        
                    // console.log({
                    //     message: 'User login successfully',
                    //     userSessionToken,
                    //     user
                    // });
                    res.status(200).json({
                        message: 'User login successfully',
                        userSessionToken,
                        user
                    })
            
                } else {
                    res.status(404).json({
                        message: 'Not correct password'
                    })
        
                }
                
            } else {
                res.status(404).json({
                    message: 'User not exist'
                })

            }

        }

        
    } catch (e) {
        res.status(500).json({
            message: "Faild to login user",
            error: e.message
        })

    }

}

//* DONE but maybe some logic are not necessary
async function registerUser({User, req, res}){
    
    console.log(req.body,'body');
    console.log(req.files);

    try {
        const registerData = req.body
        let isAdmin = false
        // const registerData = req.body.user

        if (!registerData.email || !registerData.password || !registerData.firstName || !registerData.lastName) {
            
            await personRegisterValidation({registerData, res})

        } else {
            const isEmail = await findEmail({registerData, PersonModel: User})
            
            const isUsername = await findUsername({registerData, PersonModel: User})

            if (isEmail || isUsername) {
                
                await personLoginExists({isEmail, isUsername, res})
    
            } else {
    
                registerData.password.includes(process.env.ADMIN_PASSWORD_INCLUDES) ? isAdmin = true : isAdmin
                registerData.isAdmin = isAdmin

                let registerQuery = await {...registerData}
    
                if (req.files) {
                    const directory = USER_AVATAR
                    const {pathToFile} = await imgDownload({req, res, directory})
                    registerQuery.avatar = pathToFile

                }

                const user = await User.create(registerQuery)
                if (registerData.country || registerData.city ||  registerData.post_office) {
                    await Address.create({
                        country: registerData.country,
                        city: registerData.city,
                        post_office: registerData.post_office,
                        user_id: user.id
                    })
                    
                } else {
                    await Address.create({
                        country: null,
                        city: null,
                        post_office: null,
                        user_id: user.id
                    })
                }
                
                const sessionToken = await token(user, process.env.USER_SECRET)
                res.status(201).json({
                    message: 'User created successfully',
                    sessionToken, 
                    user
                })
    
            } 

        }
        
        
    } catch (e) {
        res.status(500).json({
            message: 'Something wrong', 
            error: e.message
        })

    }

}

//*DONE MAYBE
//?--- USER VALIDATION JWT
async function updateUser({User, req, res}) {
    try {


        const user = await req.user

        const query = {
            where: {
                id: user.id
            }
        }

        const updateData = await req.body
        // const updateData = req.body.user

        let updateObj = updateData
        
            if (user != null) {
                console.log(req.files, 'req.files[0]');

                console.log(updateObj, 'updateObj');
                if (req.files) {
                    const directory = USER_AVATAR
                    const {pathToFile} = await imgDownload({req, res, directory})
                    updateObj.avatar = pathToFile

                }

                const userUpdated = await User.update(updateObj, query)
                
                if (userUpdated[0] === 1) {
                    if (updateObj.avatar) {
                        await imgDelete(user)
                        
                    }
                    // console.log(userUpdated);
                    res.status(200).json({
                        message: 'User updated successfully',
                    })
                    
                } else {
                    res.status(404).json({
                        message: 'Nothing changed',
                    })
        
                }
                
            } else {
                res.status(404).json({
                    message: 'User not found'
                })

            }
        

    } catch (e) {
        res.status(500).json({
            message: 'Something wrong', 
            error: e.message
        })

    }

}

//* DONE but not at all >>> avatar
//! FINISH WORK WITH DELETE AVATAR ++++++++++++++++++++++++++
//?--- USER VALIDATION JWT
async function deleteUser({User, req, res}) {

    try {
        const user = await req.user

        const deleteUserId = user.id
        const deleteData = req.body
        // const deleteData = req.body.user


        const deleteQuery = {
            where: {
                id: deleteUserId,
                // email: deleteData.email,
                // password: deleteData.password
                // id,
                // email,
                // password
            }
        }
        // console.log(deleteQuery);    

        
        if (user != null) {
            // const notEncrypted = await deleteData.password
            // const encrypted = await user.dataValues.password
            // const isComparedPassword = await comparePassword({notEncrypted, encrypted})

            // if (isComparedPassword) {
                const deleteUser = await User.destroy(deleteQuery)
    
                if (deleteUser === 1) {
                    if (user.avatar) {
                        await imgDelete(user)
                        
                    }
        
                    res.status(200).json({
                        message: 'Deleted successfully',
                    })
                    
                } else {
                    res.status(404).json({
                        message: 'Not found user for delete',
                    })
                    
                }
                
            // } else {
            //     res.status(404).json({
            //         message: 'Not correct password'
            //     })

            // }
            
        } else {
            res.status(404).json({
                message: 'User not found'
            })

        }

    } catch (e) {
        res.status(500).json({
            message: 'Faild to delete user',
            error: e.message
        })

    }
    
}

module.exports = { 
    findUsers,
    findUser,
    loginUser, 
    registerUser, 
    updateUser, 
    deleteUser ,
    findUserUser
}