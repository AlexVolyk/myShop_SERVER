const router = require('express').Router()


const { Cart } = require('../models/index')

//* DONE
router.post('/create', async (req, res) => {
    const cart = await Cart.bulkCreate([
        // { cart_products: [1,2,3], user_id: 1 },
        // { cart_products: [4,5,6], user_id: 2 }
        { cart_products: [1, 2, 3] },
        { cart_products: [4, 5, 6] }

    ]);

    res.json({
        cart
    })
})

//* DONE
router.get('/', async (req, res) => {
    const cart = await Cart.findAll()

    res.json({
        cart
    })
})



module.exports = router