const { Router } = require('express')
const ProductRouter = require('./api/products.router')
const UsersRouter = require('./api/usuarios.router')
const carts = require('./api/carts')
// const HomeRouter = require('./home.router')

const router = Router()

router.use('/products', ProductRouter)
router.use('/users', UsersRouter)
router.use('/carts', UsersRouter)

module.exports = router