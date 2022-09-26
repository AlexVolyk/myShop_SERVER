const router = require('express').Router()

const {
    Order,
    User,
    Product
} = require('../models/index')

const {
    findOrders,
    findOrder,
    createOrder,
    updateOrder,
    findUserOrders,
    findUserOrder,
} = require('./controllerFunctions/orderFunctions/orderFunctions')
const {
    userValidateJWT,
    adminValidateJWT
} = require('../middleware/index')


const stripe = require('stripe')(process.env.CLIENT_TOKEN)

//? USER VALIDATION JWT

router.get('/create-checkout-session', async (req, res) => {
    const url = 'http://localhost:3001/';
    const current_url = 'http://localhost:3000/';
    let c = current_url + 'images/product_avatar/hand.jpg'

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'T-shirt',
                        images: [
                            c
                        ]
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: url + 'success',
        cancel_url: url + 'cart',
    });

    res.send({url: session.url});
});

//*DONE
router.get('/user/orders', userValidateJWT, async (req, res) => {
    await findUserOrders({ Order, User, Product, req, res })
})

//*DONE
router.get('/user/order/:orderId', userValidateJWT, async (req, res) => {
    await findUserOrder({ Order, User, Product, req, res })
})


//? CREATE USER ORDER
router.post('/create', userValidateJWT, async (req, res) => {
    await createOrder({ Order, Product, User, req, res })
})



//*------------------------------------
//!not ready to do
//! need to create plural 
router.post('/create', userValidateJWT, async (req, res) => {
    await createOrders({ Order, Product, User, req, res })
})
//*------------------------------------



//?--- ADMIN VALIDATION JWT



//* DONE
router.put('/update/:orderId', adminValidateJWT, async (req, res) => {
    await updateOrder({ Order, Product, User, req, res })
})


//? FIND USERS ORDERS
router.get('/orders', adminValidateJWT, async (req, res) => {
    await findOrders({ Order, User, Product, req, res })
})

//? FIND USER ORDER
router.get('/:orderId', adminValidateJWT, async (req, res) => {
    await findOrder({ Order, req, res })
})


module.exports = router