const { Router } = require('express')
const CartManager = require('../../managers/CartManager')

const router = Router()
const cart = new CartManager('carrito.json')

router.post('/', async (req, res) => {
  const { body } = req

  const created = await cart.create(body)

  res.send(created)
})

router.get('/', async (req, res) => {
  const cart = await cart.getAll()
  res.send(cart)
})

module.exports = router