const router = require('express').Router()

const {
    Product,
    ProductImg
} = require('../models/index')

const {
    searchProducts,
    findProducts,
    findProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('./controllerFunctions/productFunctions/productFunctions')
const { adminValidateJWT } = require('../middleware/index');


router.get('/products/search', async (req, res) => {
    await searchProducts({ Product, ProductImg, req, res })
})


//* MAYBE DONE
//? FIND PRODUCTS
router.get('/products', async (req, res) => {
    await findProducts({ Product, ProductImg, req, res })
})

//* MAYBE DONE
//? FIND PRODUCT
router.get('/:productId', async (req, res) => {
    await findProduct({ Product, ProductImg, req, res })
})



//?--- ADMIN VALIDATION JWT


//* DONE
//? CREATE PRODUCTS
//!avatar upload
router.post('/create', async (req, res) => {
    await createProduct({ Product, req, res })
})
// router.post('/create', adminValidateJWT, async(req, res) => {
//     await createProduct({Product, req, res})
// })

//* DONE
//? UPDATE PRODUCTS
//!avatar upload
router.put('/update/:productId', adminValidateJWT, async (req, res) => {
    await updateProduct({ Product, req, res })
})

//* MAYBE DONE
//? DELETE PRODUCTS
router.delete('/delete/:productId', adminValidateJWT, async (req, res) => {
    await deleteProduct({ Product, ProductImg, req, res })
})

module.exports = router