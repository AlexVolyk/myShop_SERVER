const { imgDownload } = require("../../../imageFunctions/imageFunctions");
const { PRODUCT_IMG } = require("../../../directories");

//* DONE
//?--- ADMIN VALIDATION JWT
async function createProductImg({ProductImg, Product, req, res}) {
    try {
        const query = {
            where:{
                id: req.params.productId
            }
        }
    
        const product = await Product.findOne(query)
        
        if (product == null) {
            res.status(404).json({
                message: 'Product not found'
            })

        } else {
            // console.log(req.files);
            if (req.files) {
                const directory = await PRODUCT_IMG
                const {filename, pathToFile} = await imgDownload({req, res, directory})
                const productImg = await ProductImg.create({
                    name: filename,
                    url: pathToFile,
                    product_id: product.id
                })
    
                res.status(201).json({
                    message: 'Image saved successfully',
                    productImg
                })
                
            } else {
                res.status(404).json({
                    message: 'Image not found',
                })

            }
            
        }
        
    } catch (e) {
        res.status(500).json({
            message: 'Fail to save image',
            error: e.message
        })

    }
}



module.exports = {createProductImg}