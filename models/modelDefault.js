const DataType = require('sequelize')
const PRODUCT_CATEGORIES = ['electronic', 'food', 'decoration', 'home']

// module.exports = modelDefault = ({ type='STRING', allowNull=false, unique=false, modelDefaultValue=false }) => {
        module.exports = modelDefault = ({ type='STRING', allowNull=false, unique=false }) => {

    if (type === 'ARRAY') {
        type = DataType.ARRAY(DataType.INTEGER)
        
    } else if (type === 'JSON') {
        type = DataType.JSON()

    } else if (type === 'ENUM') {
        type = DataType.ENUM(...PRODUCT_CATEGORIES)

    } else {
        type = DataType[type]

    }
    
    let modelDefaultReturn = {
        type: type,
        allowNull: allowNull,
        unique: unique,
    }


    // if (modelDefaultValue) {
    //     modelDefaultReturn.defaultValue = modelDefaultValue
    // }

    // console.log(modelDefaultReturn,'modelDefaultReturn');


    return modelDefaultReturn

}
