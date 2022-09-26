
const token = require('../../../createToken')
const { comparePassword } = require('../../../bcryptFunctions')
const { 
    imgDownload, 
    imgDelete
} = require('../../../imageFunctions/imageFunctions');
const { 
    personLoginExists,
    personLoginValidation,
    personRegisterValidation,
    findEmail,
    findUsername
} = require('../personDataValidation');

const { USER_AVATAR } = require('../../../directories');

const exclude = ['createdAt', 'updatedAt']
const orderDESCid = ['id', 'DESC']


//* DONE
async function findAdmins({Admin, req, res}) {
    try {
        const admins = await Admin.findAll({
            order: [
                ['id', 'DESC']
            ]
        })

        if (admins.length) {
            res.status(200).json({
                admins
            })
            
        } else {
            res.status(404).json({
                message: 'No admins'
            })

        }
        
    } catch (e) {
        res.status(500).json({
            message: 'Find faild',
            error: e.message
        })
        
    }
    
}

//* DONE
async function findAdmin({Admin, req, res}) {
    try {

        const query = {
            where: {
                id: req.params.id
            }
        }
        const admin = await Admin.findOne(query)

        if (admin) {
            res.status(200).json({
                admin
            })
            
        } else {
            res.status(404).json({
                message: 'Admin not found'
            })

        }

    } catch (e) {
        res.status(500).json({
            message: 'Find faild',
            error: e.message
        })

    }

}

//* DONE
async function loginAdmin({Admin, req, res}) {
    try {
        // const loginData = req.body.admin
        const loginData = req.body
        
        const loginQuery = {
            where: {
                email: loginData.email,
                // password: loginData.passwordyy

            },
            attributes: {
                exclude
            }
        }

        if (!loginData.email || !loginData.password) {

            await personLoginValidation({loginData, res})

        } else { 
            const admin = await Admin.findOne(loginQuery)

            if (admin) {
                const notEncrypted = await loginData.password;
                const encrypted = await admin.password;
        
                const isComparePassword = await comparePassword({notEncrypted, encrypted})
            
                if (isComparePassword) {
                    const sessionToken = await token(admin, process.env.ADMIN_SECRET)
        
                    res.status(200).json({
                        message: 'Admin login successfully',
                        sessionToken,
                        admin
                    })
                
                } else {
                    res.status(404).json({
                        message: 'Not correct password'
                    })
        
                }
                
            } else {
                res.status(404).json({
                    message: 'Admin not exist'
                })

            }

        }

    } catch (e) {
        res.status(500).json({
            message: 'Login faild',
            error: e.message
        })

    }

}

//* DONE
async function createAdmin({Admin, req, res}) {
    try {
        const registerData = await req.body

        if (!registerData.email || !registerData.password || !registerData.firstName || !registerData.lastName) {

            await personRegisterValidation({registerData, res})

        } else {

            const isEmail = await findEmail({registerData, PersonModel: Admin})
            
            const isUsername = await findUsername({registerData, PersonModel: Admin})

            if (isEmail || isUsername) {
                
                await personLoginExists({isEmail, isUsername, res})

            } else {
            let createQuery = {...registerData}

            if (req.files) {
                const directory = USER_AVATAR
                const {pathToFile} = await imgDownload({req, res, directory})
                createQuery.avatar = pathToFile

            }
            const admin = await Admin.create(createQuery)

            const sessionToken = await token(admin, process.env.ADMIN_SECRET)
            res.status(201).json({
                message: 'Admin created successfully',
                sessionToken, 
                admin
            })

            }
        }

    } catch (e) {
        res.status(500).json({
            message: 'Create faild',
            error: e.message
        })
        
    }
}

//* DONE
async function updateAdmin({Admin, req, res}) {
    try {
        
        const admin = req.admin
        const query = {
            where: {
                id: admin.id
            }
        }

        // const updateData = req.body.admin
        const updateData = req.body

        let updateObj = updateData
        
        if (admin != null) {
            if (req.files) {
                const directory = USER_AVATAR
                const {pathToFile} = await imgDownload({req, res, directory})
                updateObj.avatar = pathToFile
                
            }
            
            const adminUpdated = await Admin.update(updateObj, query)
            
            if (adminUpdated[0] === 1) {
                res.status(200).json({
                    message: 'Admin updated successfully',
                })
                
            } else {
                res.status(404).json({
                    message: 'Nothing changed',
                })
                
            }
            
        } else {
            res.status(404).json({
                message: 'Admin not found'
            })

        }
        
    } catch (e) {
        res.status(500).json({
            message: 'Update faild',
            error: e.message
        })
        
    }
}





module.exports = {
    findAdmins, 
    findAdmin, 
    loginAdmin, 
    createAdmin, 
    updateAdmin
}