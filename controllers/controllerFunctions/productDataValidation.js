const productCreateValidation = ({createData, res}) => {
    let message;
    
    if (!createData.name && !createData.price && !createData.description) {
        message = 'Please write name, price, type, description of the product'
    
    } else if (!createData.price) {
        message = 'Please write price of the product'
    
    } else if (!createData.name) {
        message = 'Please write name of the product'
    
    } else if (!createData.description) {
        message = 'Please write description of the product'
    
    } else if (!createData.type) {
        message = 'Please write type of the product'
    
    } 

    res.status(404).json({
        message
    })

}

module.exports = {productCreateValidation}