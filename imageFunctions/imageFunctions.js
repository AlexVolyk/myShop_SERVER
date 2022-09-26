const fs = require('fs')

async function imgDownload({req, res, directory}) {
    let file = req.files.img
    let filename = file.name
    let d = new Date().toISOString().replace(/:/g, '-')
    
    filename = d + "__" + filename
    let pathToFile = 'images/' + directory + '/' + filename
    let relativePath = './'

    file.mv(relativePath + pathToFile, (e) => {
        if (e) {
            res.status(500).json({
                message: 'Image was not upload',
                error: e.message
            }

        )} 
        
    })

    return {filename, pathToFile}

}

async function imgDelete(data) {

    if (data.length == undefined) {
        let arr = ['avatar', 'product_avatar']
        for (const i of arr) {
            subDelete(data.dataValues[i])
            if (data.dataValues[i]) break;
            
        }

    } else {

        for (const d of data) {
            subDelete(d.dataValues.url)
            
        }

    }

}

async function subDelete(url) {
    fs.unlink(url, (err) => {
        if (err) {
            console.log(url);
            throw err

        };

    })
}

module.exports = {
    imgDownload, 
    imgDelete
}