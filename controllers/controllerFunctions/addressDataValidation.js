const addressCreateValidation = ({createData, res}) => {
    let message;

    if (!createData.country && !createData.city && !createData.post_office) {
        message = 'Need country, city, post office'

    }  else if (!createData.country) {
        message = 'Need country'

    } else if (!createData.city) {
        message = 'Need city'

    } else if (!createData.post_office) {
        message = 'Need post office'

    }
    
    res.status(404).json({
        message
    })
    
}

module.exports = {addressCreateValidation}