const {addressCreateValidation} = require("../addressDataValidation")

// //* DONE
async function findAddress({Address, req, res}) {
    try {

        const query = {
            where: {
                id: req.params.addressId
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'user_id']
            }
        }

        const address = await Address.findOne(query)

        if (address) {
            res.status(200).json({
                address
            })
            
        } else {
            res.status(404).json({
                message: 'Address not found'
            })

        }
        
    } catch (e) {
        res.status(500).json({
            message: 'Created faild',
            error: e.message
        })
        
    }
}

//* DONE
async function createAddress({Address, req, res}) {
    try {

        // const user_id = req.user.id

        const user_id = req.user.id

        // const createData = req.body.address 
        const createData = req.body 


        const createQuery = {
            ...createData,
            user_id
        }

        if (!createData.country || !createData.city || !createData.post_office) {
            
            await addressCreateValidation({createData, res})

        } else {
            const address = await Address.create(createQuery)
        
            res.status(201).json({
                message: 'Created successfully',
                address
            })

        }

        
    } catch (e) {
        res.status(500).json({
            message: 'Created faild',
            error: e.message
        })

    }
}

//* DONE
async function updateAddress({Address, req, res}) {
    try {

        // const user_id = req.user.id
        const user_id = req.user.id
        // const updateData = req.body.address
        const updateData = req.body

        const query = {
            where: {
                user_id
            }
        }

        
        const address = await Address.update(updateData, query)

        if (address[0] === 1) {
            res.status(200).json({
                message: 'Updated successfully',
            })
            
        } else {
            res.status(404).json({
                message: 'Address not updated',
            })

        }


    } catch (e) {
        res.status(500).json({
            message: 'Update address faild',
            error: e.message
        })

    }
}


module.exports = {
    // findAddress, 
    createAddress, 
    updateAddress
}