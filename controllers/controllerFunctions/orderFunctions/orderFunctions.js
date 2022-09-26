const _ = require('lodash')
const { Op } = require("sequelize");
const { Cart } = require('../../../models');

async function getCartQuery(orders) {
    let cartIdsQuery = []
    for (const order of orders) {
        cartIdsQuery.push(order.cart_id)
    }

    let cartQuery = {
        where: {
            id: {
                [Op.in]: cartIdsQuery
            }
        }
    }

    return cartQuery
}

async function getProductQuery({ carts, amount = 'plural' }) {

    let productIdsQuery = [];
    let productCartInfo = [];


    if (amount == 'plural') {
        for (const cart of carts) {
            // console.log(cart.cart_info,'casrasradsadasdsa');

            productIdsQuery.push(...cart.cart_products_ids)
            productCartInfo.push(...cart.cart_info)

        }

    } else if (amount == 'single') {
        carts = carts.dataValues.cart_products_ids
        for (const cart of carts) {
            productIdsQuery.push(cart)
        }
    }
    productIdsQuery = await new Set(productIdsQuery)
    productIdsQuery = await Array.from(productIdsQuery)

    let productQuery = {
        where: {
            id: {
                [Op.in]: productIdsQuery
            }
        }
    }

    return { productQuery, productCartInfo }

}

async function getOrderWithCartProducts({ orders, carts, groupProducts, groupCarts, productCartInfo, amount = 'plural' }) {
    let result = await [];
    if (amount == 'plural') {
        for (let i = await 0; i < orders.length; await i++) {
            let order = await orders[i].dataValues
            // console.log(orderm, 'order');

            // console.log(carts[i].id, 'carts id');
            // console.log(carts[i].cart_products_ids, 'carts cart_products_ids');
            // console.log(carts[i].cart_info, 'carts cart_info');


            // const currentOrder = await orders[i]
            const currentOrder = await order

            // console.log(currentOrder);
            // console.log(prod,'prod');
            // console.log(orders[i]);
            // console.log('there are plural == == == == ==== == == == ==  ======== ==  ==== == == == ==== == == ==');

            let cartNum = await carts[i] //cart
            // console.log(p, 'p');

            // console.log(prod,'prod');
            // console.log(cartNum, 'cartNum');
            // console.log(prod,'prodBefore');
            order.cart_p = await getCartProducts({ currentOrder, cartNum, groupProducts, groupCarts, productCartInfo, amount })
            // console.log(prod.cart_p[0],'prodAfter');
            // console.log(p.cart_p[0], 'p', i);

            // console.log(prod);
            // console.log(prod.id);
            let cartPPP = await order
            // console.log(cartPPP.cart_p[0].cart_product_info,'prod.cart_p');
            // console.log(cartPPP.cart_p[1].cart_product_info,'prod.cart_p');

            // console.log(prod);

            result.push(cartPPP)
            // console.log(result[i].cart_p[0], '0');
            // console.log(result[i].cart_p[1], '1');

        }
        // for (const resu of result) {
        //     let r = resu.cart_p
        //     console.log(r[0]);
        //     console.log(r[1]);

        // }
        return result
        // console.log(result[1].cart_p[1],'result');

        // console.log(result[0].cart_p[0],'result');

    } else if (amount == 'single') {

        let cartNum = await carts

        orders = orders.dataValues
        console.log('there are single - - - - -- - - - -  ---- -  -- - - - -- - - -');
        orders.cart_p = await getCartProducts(cartNum, groupProducts, { amount: 'single' })

        await result.push(orders)
    }

    // console.log(result, 'result');

    return await result

}

async function getCartProducts({ currentOrder, cartNum = null, groupProducts, groupCarts, productCartInfo, amount = 'plural' }) {

    let arrayOfProducts = await []
    // console.log(productCartInfo);
    // console.log(cartNum);

    // console.log(groupCarts['1'][0].cart_info, 'groupCarts');

    // console.log(cartNum, 'cartNumcartNumcartNum');
    // console.log(cartNum.cart_products_ids, 'cartNum.cart_products_ids');
    // console.log(cartNum.cart_info, 'cartNum.cart_info');
    const currentCart = await groupCarts[currentOrder.cart_id][0]
    // const d =structuredClone(obj)
    // console.log(currentCart, 'currentCart');
    // console.log(d,'d');
    const currentCartCart_info = await currentCart.cart_info
    const cart_products_ids = await currentCart.cart_products_ids
    const groupCart_Info = await _.groupBy(currentCartCart_info, (e) => e.product_id)



    // console.log(currentOrder, 'currentOrder');
    // console.log(cart_products_ids);
    // console.log(groupCart_Info, 'groupCart_Info');


    // console.log(groupProducts);
    // console.log(groupCart_Info);

    if (amount == 'plural') {
        // cart_products_id -> id of current product
        // pCart -> current product
        //currentProduct -> currentProduct

        for (let i = 0; i < cart_products_ids.length; i++) {
            const cart_products_id = await cart_products_ids[i]
            // console.log(cart_products_id);
            let currentProduct = await groupProducts[cart_products_id]
            // console.log(currentProduct[0].dataValues,'currentProduct');

            let cart_info = await groupCart_Info[cart_products_id]
            // console.log(cart_info, 'cart_info');


            let iCart = await cart_info
            //! from here to 
            currentProduct = await currentProduct[0]

            let currentProductCopy = Object.assign({}, currentProduct)
            //! there was problem --> products always get the .cart_product_info in the main object, that's why we need here to assign -> create copy

            currentProductCopy.cart_product_info = await iCart

            await arrayOfProducts.push(currentProductCopy)

        }
        // console.log(arrayOfProducts, 'arrayOfProducts');


    } else if (amount == 'single') {

        for (const cartP of cartNum.cart_products_ids) {
            let pCart = await groupProducts[cartP]
            let cart_products_ids = await pCart[0].dataValues
            await arrayOfProducts.push(cart_products_ids)
        }

    }
    return await arrayOfProducts

}

async function getProductsFromCart({ orders, Product, Cart }) {
    let result;
    const amount = 'plural'

    const cartQuery = await getCartQuery(orders)
    const carts = await Cart.findAll(cartQuery)
    // console.log(carts, 'carts');
    const { productQuery, productCartInfo } = await getProductQuery({ carts, amount })
    // console.log('result sadsadasdadsaaddasd');
    const products = await Product.findAll(productQuery)
    // console.log(products, 'products');
    let newProducts = await []
    let newCarts = await []

    for (const product of products) {
        await newProducts.push(product.dataValues);
    }

    for (const cart of carts) {
        await newCarts.push(cart.dataValues);
    }
    // console.log(products, 'products');
    const groupProducts = await _.groupBy(newProducts, (p) => p.id) //! POTENTIAL PROBLEM
    const groupCarts = await _.groupBy(newCarts, (cart) => cart.id)
    // console.log(groupProducts);
    // console.log(groupCarts, 'groupCarts');

    // console.log(productCartInfo,'productCartInfo');
    // console.log(groupProducts, 'groupProducts'); productst key-id value-object
    result = await getOrderWithCartProducts({ orders, carts, groupProducts, groupCarts, productCartInfo, amount })
    // for (const re of result) {
    //     console.log(re.id, 'id');
    //     console.log(re.cart_p[0].cart_product_info,'cart_product_info');
    //     console.log(re.cart_p[1].cart_product_info,'cart_product_info');


    // }


    return await result

}

async function getProductFromCart(orders, carts, Product) {
    let result;
    const amount = 'single'

    const productQuery = await getProductQuery(carts, { amount })
    const products = await Product.findAll(productQuery)
    // console.log(products, 'PRODUCTS');

    const groupProducts = await _.groupBy(products, (p) => p.id)
    // console.log(groupProducts, 'groupProducts');


    result = await getOrderWithCartProducts({ orders, carts, groupProducts, amount })
    // console.log(result, 'resultresultresultresult');


    return result

}

const getProductsIdsFromOrdersCarts = orders => {
    const ids = [];
    for (const order_carts of orders) {
        ids.push(...order_carts.cart.cart_products_ids)
    }
    let newO = new Set(ids)
    newO = [...newO]
    console.log(newO);

    return newO
}


const getProductsObjectById = allProducts => {
    return products = _.groupBy(allProducts, 'dataValues.id')

}

//*DONE
async function findUserOrders({ Order, User, Product, req, res }) {


    try {
        const user = req.user

        const orderQuery = {
            where: {
                user_id: user.id
            }
        }

        let orders = await Order.findAll({
            ...orderQuery,
            order: [
                ['id', 'DESC']
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", 'user_id'],
            },
            include: [
                {
                    model: Cart,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
                // {
                //     model: User,
                //     attributes: ['id', 'username'],
                // }
            ]
        })
        // console.log(orders,'orders');

        if (orders.length) {
            // console.log(orders);

            const carts_ids = getProductsIdsFromOrdersCarts(orders)

            const allProudcts = await Product.findAll({
                where: {
                    id: {
                [Op.in]: carts_ids
            },
        },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'description']
            }
        })
        // console.log(allProudcts,'allProudcts');
        const products = getProductsObjectById(allProudcts)

        // console.log(products,'products');
        // let newResult = orders

        for (const order of orders) {

            // console.log(nR.dataValues.cart, '============');
            // console.log(nR.dataValues.cart.dataValues.cart_info, '============');
            let cart_info_list_products = order.dataValues.cart.cart_info
            // console.log(cart_info_list_products,'---------');

            for (const cart_info of cart_info_list_products) {
                console.log(cart_info, 'ccccccccccccccccc');
                let b = cart_info
                b.cart_product = products[b.product_id]
                // console.log(b);
            }
            
        }
        //* I need to put products into their cart_info product and to return the result
        //* maybe it means that i need to use new one object for these logic because I will modify the previous one
        // newResult.c_ids = c_ids
        // newResult.c_info = c_info

        // let newResult = 'newOne'
        const result = orders

        // const result = await getProductsFromCart({ orders, Product, Cart })
        // console.log(result, 'there last result');

        res.status(200).json({
            result
            // newResult
        })


    } else {
        res.status(404).json({
            message: 'No orders'
        })

    }

} catch (e) {
    res.status(500).json({
        message: 'Orders faild',
        error: e.message,
    })

}
}

//*DONE
async function findUserOrder({ Order, User, Product, req, res }) {

    try {
        const user = req.user
        // let p = req.params.orderId
        // let user = {
        //     id: 1
        // }

        const orderQuery = {
            where: {
                id: req.params.orderId,
                user_id: user.id,
                // order: req.params.orderId
            }
        }

        const order = await Order.findOne(orderQuery)

        const cartQuery = {
            where: {
                id: order.id
            }
        }
        if (order !== null) {
            const cart = await Cart.findOne(cartQuery)

            if (cart !== null) {
                const result = await getProductFromCart(order, cart, Product)

                res.status(200).json({
                    result
                })

            } else {
                res.status(404).json({
                    message: 'Cart not exists'
                })

            }



        } else {
            res.status(404).json({
                message: 'Order not exists'
            })

        }

    } catch (e) {
        res.status(500).json({
            message: 'Orders faild',
            error: e.message,
        })

    }
}

// Cart
//?--- USER VALIDATION JWT
async function createOrder({ Order, Product, User, req, res }) {

    try {

        const user_id = await req.user.id
        const userTotal_spend = await req.user.total_spend

        const userCart = await {
            user_id,
            total_sum: +req.body.total_sum,
            products_ids: req.body.products_ids,
            products: req.body.products
        }
        // console.log(userCart);

        let cart_products_ids = await userCart.products_ids
        const query = await {
            where: {
                id: {
                    [Op.in]: cart_products_ids
                }
            }
        }


        let product = await Product.findAll(query)
        if (product !== null &&
            product
            // &&
            // product.length == cart.products.length
        ) {
            let ci = await [];
            let cart_total_sum = await 0;
            let price,
                count,
                total_sum;

            let prodId;

            // console.log(product,'product');
            for (const prod of product) {
                prodId = await [prod.id]
                price = prod.price
                count = userCart.products[prodId].count
                total_sum = price * count

                let cartInfoProduct = await {
                    // [prodId]: {
                    count,
                    price,
                    total_sum,
                    product_id: prod.id
                    // }
                }


                cart_total_sum += await total_sum

                await ci.push(cartInfoProduct)

            }

            await cart_total_sum.toFixed(2)


            console.log(userCart.total_sum === cart_total_sum);
            console.log(userCart.total_sum, cart_total_sum);

            if (userCart.total_sum === cart_total_sum) {

                const cart = await Cart.create({
                    cart_products_ids: cart_products_ids,
                    cart_info: ci
                })


                const order = await Order.create({
                    user_id,
                    cart_id: cart.id,
                    total_sum: cart_total_sum
                })

                const newUserTotal_spend = await userTotal_spend + cart_total_sum
                console.log('before');
                await User.update(
                    {
                        total_spend: newUserTotal_spend
                    },
                    {
                        where: {
                            id: user_id
                        }
                    }
                )

                // console.log('after');


                res.status(201).json({
                    message: 'Order created successfully',
                    order
                })



            } else {
                res.status(404).json({
                    message: 'Cart total sum are not the same'
                })
            }




        } else {
            res.status(404).json({
                message: 'Product not found'
            })

        }


    } catch (e) {

        res.status(500).json({
            message: 'Create faild',
            error: e.message,
        })

    }

}



//* DONE
//?--- ADMIN VALIDATION JWT
async function updateOrder({ Order, Product, User, req, res }) {

    try {

        // const id = await req.body.order.id
        const id = await req.params.orderId

        const updObj = {
            product_status: 'going'
        }

        // const updObj = {
        // ...req.body.order
        // }

        const query = {
            where: {
                id
            }
        }

        const orderUpdated = await Order.update(updObj, query)

        if (orderUpdated[0] === 1) {
            res.status(200).json({
                message: 'Order updated successfully',
            })

        } else {
            res.status(404).json({
                message: 'Nothing changed',
            })

        }

    } catch (e) {
        res.status(500).json({
            message: 'update faild',
            error: e.message
        })

    }

}


//!>>>>>>>
//?--- ADMIN VALIDATION JWT
//! ALL ORDERS FOR ADMIN
//******** MAYBE DELETE
async function findOrders({ Order, User, Product, req, res }) {

    try {
        // const user = req.user


        const orders = await Order.findAll({
            //     include: [
            //         {
            //         model: User,
            //         as: 'costumer'
            //     },
            //     {
            //         model: Product,
            //         as: 'item'
            //     }
            // ]
            order: [
                ['id', 'DESC']
            ]
        })


        if (orders.length) {
            res.status(200).json({
                orders
            })

        } else {
            res.status(404).json({
                message: 'No orders'
            })

        }


    } catch (e) {
        res.status(500).json({
            message: 'Orders faild',
            error: e.message,
            // e: error
        })

    }
}

//!>>>>>>>
//?--- ADMIN VALIDATION JWT
//******* MAYBE DELETE
async function findOrder({ Order, req, res }) {

    try {
        let query = {
            where: {
                id: req.param.orderId
            }
        }

        const orders = await Order.findOne(query)

        if (order !== null) {
            res.status(200).json({
                orders
            })

        } else {
            res.status(404).json({
                message: 'Order not exist'
            })

        }


    } catch (e) {
        req.status(500).json({
            message: 'Order faild',
            error: e.message
        })

    }
}



module.exports = {
    findUserOrders,
    findUserOrder,
    findOrders,
    findOrder,
    createOrder,
    updateOrder
}