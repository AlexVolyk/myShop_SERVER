const {
    imgDownload,
    imgDelete
} = require("../../../imageFunctions/imageFunctions");
const { productCreateValidation } = require("../productDataValidation");
const { PRODUCT_AVATAR } = require("../../../directories");
const { Op, fn, col } = require("sequelize");

const ex = ['createdAt', 'updatedAt']

const productPerPage = 6

//* MAYBE DONE



async function searchProducts({ Product, ProductImg, req, res }) {
    try {
        // console.log('s------');

        let product_name = req.query?.product_name
        let searchPage = req.query?.searchPage
        let currentPage = searchPage
        // let arr = await req.query?.type?.split(',')
        // let min = await +req.query?.min
        // let max = await +req.query?.max
        // let currentPage = await +req.query?.currentPage
        // console.log(product_name, '============');
        // console.log(searchPage, '============');


        // console.log(req.query);
        // console.log(arr);
        let query;
        let aggreQuery;
        query = await {
            order: [
                ['id', 'DESC']
            ],
            attributes:
            {
                exclude: ex,
            },
        };

        aggreQuery = await {
            attributes: [
                [fn('min', col('price')), 'minPrice'],
                [fn('max', col('price')), 'maxPrice'],
                [fn('count', col('id')), 'totalProducts'],
            ]
        }

        // console.log(query);
        if (product_name) {
            query.where = await {
                name: {
                    [Op.substring]: product_name
                }
            }

            aggreQuery.where = await {
                name: {
                    [Op.substring]: product_name
                }
            }
        }

        // query.limit = productPerPage
        // query.offset = (currentPage - 1) * productPerPage

        // if (min && max) {
        //     query.where = await {
        //         ...query.where,
        //         price: {
        //             [Op.gte]: min,
        //             [Op.lte]: max

        //         }
        //     }

        //     aggreQuery.where = await {
        //         ...aggreQuery.where,
        //         price: {
        //             [Op.gte]: min,
        //             [Op.lte]: max

        //         }
        //     }

        // }
        query.limit = productPerPage
        query.offset = (currentPage - 1) * productPerPage
        // console.log(query);
        // console.log(aggreQuery);




        const products = await Product.findAll(query)
        // const p = await Product.findAll()
        // console.log(p);

        let result = await Product.findAll(aggreQuery)
        // include: { 
        // model: ProductImg,
        // attributes: {
        //     exclude: ex
        // }
        // },
        // console.log(products);
        // let re = result
        result[0].dataValues.totalPages = await Math.ceil(+result[0].dataValues.totalProducts / productPerPage)

        if (products.length) {
            // console.log(products)
            res.status(200).json({
                products,
                result,
            })

        } else {
            // console.log(query)
            console.log(result);
            console.log(products);
            res.status(404).json({
                message: 'No products searched',
            })

        }

    } catch (e) {
        res.status(500).json({
            message: 'Not able to search products',
            error: e.message
        })

    }
}

async function findProducts({ Product, ProductImg, req, res }) {
    // const product_avatar = 'images\\product_avatar\\hand.jpg'

    // Product.bulkCreate([
    //     { name: 'apple', price: 10.10, type: 'food', admin_id: 1, description: 'Long string', product_avatar },
    //     { name: 'burger', price: 11.11, type: 'food', admin_id: 1, description: 'Long string', product_avatar },
    //     { name: 'Iphone', price: 12.12, type: 'electronic', admin_id: 1, description: 'Long string', product_avatar },
    //     { name: 'watch', price: 13.13, type: 'electronic', admin_id: 1, description: 'Long string', product_avatar },
    //     { name: 'sofa', price: 14.14, type: 'decoration', admin_id: 1, description: 'Long string', product_avatar },
    //     { name: 'chair', price: 15.15, type: 'decoration', admin_id: 1, description: 'Long string', product_avatar },
    //     { name: 'towel', price: 16.16, type: 'home', admin_id: 1, description: 'Long string', product_avatar },
    //     { name: 'fence', price: 17.17, type: 'home', admin_id: 1, description: 'Long string', product_avatar },
    //     { name: 'pillow', price: 18.18, type: 'food', admin_id: 1, description: 'Long string', product_avatar },
    //     { name: 'macbook', price: 19.19, type: 'electronic', admin_id: 1, description: 'Long string', product_avatar },
    // ]);
    // console.log('asaas');

    try {
        console.log(req.query);

        // let arr = await req.query?.type?.split(',')
        let arr = await req.query?.type
        let min = await +req.query?.min
        let max = await +req.query?.max
        let currentPage = await +req.query?.currentPage



        // console.log(req.query);
        // console.log(arr);
        let query;
        let aggreQuery;
        query = await {
            order: [
                ['id', 'DESC']
            ],
            attributes:
            {
                exclude: ex,
            },
        };

        aggreQuery = await {
            attributes: [
                [fn('min', col('price')), 'minPrice'],
                [fn('max', col('price')), 'maxPrice'],
                [fn('count', col('id')), 'totalProducts'],
            ]
        }

        // console.log(query);
        if (arr) {
            query.where = await {
                type: {
                    [Op.in]: arr
                }
            }

            aggreQuery.where = await {
                type: {
                    [Op.in]: arr
                }
            }
        }

        if (min && max) {
            query.where = await {
                ...query.where,
                price: {
                    [Op.gte]: min,
                    [Op.lte]: max

                }
            }

            aggreQuery.where = await {
                ...aggreQuery.where,
                price: {
                    [Op.gte]: min,
                    [Op.lte]: max

                }
            }

        }
        query.limit = productPerPage
        query.offset = (currentPage - 1) * productPerPage
        // console.log(query);
        // console.log(aggreQuery);




        const products = await Product.findAll(query)
        // const p = await Product.findAll()
        // console.log(p);

        let result = await Product.findAll(aggreQuery)
        // include: { 
        // model: ProductImg,
        // attributes: {
        //     exclude: ex
        // }
        // },
        // console.log(products);
        // let re = result
        result[0].dataValues.totalPages = await Math.ceil(+result[0].dataValues.totalProducts / productPerPage)
        // console.log(re);
        // re

        // result[0].product.dataValues.pages = +result.product.dataValues.totalProducts / 3
        // console.log(result);
        if (products.length) {
            console.log(products)
            res.status(200).json({
                products,
                result,
            })

        } else {
            // console.log(query)
            console.log(result);
            console.log(products);
            res.status(404).json({
                message: 'No products',
            })

        }

    } catch (e) {
        console.log('message: Not able to find products');
        res.status(500).json({
            message: 'Not able to find products',
            error: e.message
        })

    }
}

//* MAYBE DONE
async function findProduct({ Product, ProductImg, req, res }) {

    try {
        const query = {
            where: {
                id: req.params.productId
            }
        }


        const product = await Product.findOne({
            ...query,
            include: {
                model: ProductImg,
            },
            // include: { 
            //     model: ProductImg,
            //     attributes: {
            //         exclude: ex
            //     }
            // },
            attributes: {
                exclude: ex
            }
        })

        if (product) {
            res.status(200).json({
                product
            })

        } else {
            res.status(404).json({
                message: 'Product not found'
            })

        }

    } catch (e) {
        res.status(500).json({
            message: 'Not able to find product',
            error: e.message
        })

    }

}

//* DONE
//?--- ADMIN VALIDATION JWT
async function createProduct({ Product, req, res }) {

    try {
        const createData = req.body
        console.log(req.files);
        console.log(createData, 'createData');
        // let createQuery = {
        //     ...createData,
        //     admin_id: req.admin.id
        // }

        // let createQuery = {
        //     ...createData,
        //     admin_id: 1
        // }

        // if (!createData.name || !createData.price || !createData.description || !createData.type) {

        //     await productCreateValidation({ createData, res })

        // } else {

        //     if (req.files) {
        //         const directory = PRODUCT_AVATAR
        //         const { pathToFile } = await imgDownload({ req, res, directory })
        //         createQuery.product_avatar = pathToFile
        //     }

        //     const product = await Product.create(createQuery)

            res.status(201).json({
                message: 'Product created successfully',
                // product
            })

        // }

    } catch (e) {
        res.status(500).json({
            message: 'Product not created',
            error: e.message
        })

    }
}


//* DONE
//?--- ADMIN VALIDATION JWT
async function updateProduct({ Product, req, res }) {
    try {

        // let updObj = await req.body.product

        let updObj = await req.body

        const query = {
            where: {
                id: req.params.productId
            }
        }

        if (req.files) {
            const directory = PRODUCT_AVATAR
            const { pathToFile } = await imgDownload({ req, res, directory })
            updObj.product_avatar = pathToFile
        }
        const product = await Product.update(updObj, query)

        if (product[0] == 1) {
            res.status(200).json({
                message: 'Updated successfully',
            })

        } else {
            res.status(404).json({
                message: 'No changes'
            })

        }


    } catch (e) {
        res.status(500).json({
            message: 'Not able to update now',
            error: e
        })

    }
}

//* MAYBE DONE
//?--- ADMIN VALIDATION JWT
async function deleteProduct({ Product, ProductImg, req, res }) {
    try {
        const id = req.params.productId

        const query = {
            where: {
                id
            }
        }


        const isExist = await Product.findOne(query)

        if (!isExist) {
            res.json({
                message: "Not found product"
            })
        }
        const deleteQuery = {
            where: {
                product_id: id
            }
        }


        let deleteProduct = await Product.destroy(query)

        if (deleteProduct === 1) {
            let ProductImgArray = await ProductImg.findAll(deleteQuery)

            if (ProductImgArray) {
                await imgDelete(ProductImgArray)

                await ProductImg.destroy(deleteQuery)

            }
            res.status(200).json({
                message: 'Deleted successfully',
            })


        } else {
            res.status(404).json({
                message: 'Not found user for delete',
            })

        }

        res.status(200).json({
            message: 'Deleted successfully'
        })

    } catch (e) {
        res.status(500).json({
            message: 'Not able to delete',
            error: e.message
        })

    }

}

module.exports = {
    searchProducts,
    findProducts,
    findProduct,
    createProduct,
    updateProduct,
    deleteProduct
}