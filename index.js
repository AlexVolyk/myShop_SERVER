require('dotenv').config()
const Express = require('express')
const app = Express()
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')


const db = require('./db')
const controllers = require('./controllers/index')

// const videoController = require('./videoController')

const cart = require('./controllers/cart')



app.use(cors())
app.use(bodyParser.json())
app.use(fileUpload())


// app.use(
//     Express.urlencoded({
//       extended: true,
//     })
//   );
// app.use('/video', videoController)

app.use('/user', controllers.userController)
app.use('/address', controllers.addressController)

app.use('/admin', controllers.adminController)
app.use('/product', controllers.productController)
app.use('/product_img', controllers.productImgController)

app.use('/order', controllers.orderController)

app.use('/images', Express.static('images'))

app.use('/cart', cart)



db.authenticate()
    // .then(() => db.sync({ force: true }))
    .then(() => db.sync())
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[SERVER]: App is listening on ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log(`[SERVER]: crashed ${err}`)
    })