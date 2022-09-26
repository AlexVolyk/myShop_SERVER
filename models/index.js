const User = require('./user')
const Address = require('./address')

const Admin = require('./admin')
const Product = require('./product')
const ProductImg = require('./productImg')

const Order = require('./order')

const Cart = require('./cart')

//* user has one address
User.hasOne(Address, { foreignKey: 'user_id' })
Address.belongsTo(User, { foreignKey: 'user_id' })

// //* admin has many created products
Admin.hasMany(Product, { foreignKey: 'admin_id' })
Product.belongsTo(Admin, { foreignKey: 'admin_id' })

// //* product has many productImg
Product.hasMany(ProductImg, { foreignKey: 'product_id' })
ProductImg.belongsTo(Product, { foreignKey: 'product_id' })

// //* order has user


// User.belongsToMany(User, { as: 'USER', through: Order, foreignKey: "id_user", targetKey: "id" })
// Product.belongsToMany(Product, { as: 'PRODUCT', through: Order, foreignKey: "id_product", targetKey: "id",   constraints: false
// })


// Order.belongsTo(Product, { as: 'PRODUCT', foreignKey: "id_product", targetKey: "id",   constraints: false
// })
// Order.belongsTo(User, { as: 'USER', foreignKey: "id_user", targetKey: "id" })

// //* order has product +++++++++++++++++++++++++++



// User.belongsToMany(Product, { as: 'costumer', through: Order, foreignKey: 'id_user' })

// Order.belongsTo(Product, { as: 'item', foreignKey: 'id_product' })
// //*-------------------------
// Product.belongsToMany(User, { as: 'item', through: Order, foreignKey: 'id_product' })
// Order.belongsTo(User, { as: 'costumer', foreignKey: 'id_user' })
// //*-------------------------


User.belongsToMany(Cart, { through: Order, foreignKey: 'user_id' })
Cart.belongsToMany(User, { through: Order, foreignKey: 'cart_id' })
Order.belongsTo(User, { foreignKey: 'user_id' });
Order.belongsTo(Cart, { foreignKey: 'cart_id' });



// User.belongsToMany(User, { as: 'costumer', through: Order, foreignKey: "id_user"})
// Order.belongsTo(User, { as: 'costumer', foreignKey: "id_user" })

// Product.belongsToMany(Product, { as: 'item', through: Order, foreignKey: "id_product"})
// Order.belongsTo(Product, { as: 'item', foreignKey: "id_product"})

module.exports = {
    User,
    Address,
    Admin,
    Product,
    ProductImg,
    Order,
    Cart
}