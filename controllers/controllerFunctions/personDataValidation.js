const findEmail = ({registerData, PersonModel}) => {
    return PersonModel.findOne({
        where: {
            email: registerData.email
        },
        attributes: ['email']
    })
}

const findUsername = ({registerData, PersonModel}) => {
    return PersonModel.findOne({
        where: {
            username: registerData.username
        },
        attributes: ['username']
    })
}


const personLoginExists = ({isEmail, isUsername, res}) => {
    let message;
    
    if (isEmail) {
        message = 'THIS EMAIL ALREADY USED'

    } else if (isUsername) {
        message = 'THIS USERNAME ALREADY USED'

    } else {
        message = 'SOMETHING WRONG WITH DATA'

    }

    res.status(409).json({
        message
    })

}

const personLoginValidation = ({loginData, res}) => {
    let message;

    if (!loginData.email && !loginData.password) {
        message = 'Need email & password'

    } else if (!loginData.email) {
        message = 'Need email'

    } else {
        message = 'Need password'

    }

    res.status(404).json({
        message
    })

}

const personRegisterValidation = ({registerData, res}) => {
    let message;

    if (!registerData.email && !registerData.password && !registerData.firstName || !registerData.lastName) {
        message = 'Need email, password, first name and last name'

    } else if (!registerData.email) {
        message = 'Need email'

    } else if (!registerData.password) {
        message = 'Need password'
        
    } else if (!registerData.firstName) {
        message = 'Need first name'

    } else if (!registerData.lastName) {
        message = 'Need last name'
        
    }

    res.status(404).json({
        message
    })

} 

module.exports = {
    personLoginExists,
    personLoginValidation,
    personRegisterValidation,
    findEmail,
    findUsername
}