const express = require('express')
const router = express.Router()
const CartManager = require('../../managers/CartManager')

const cartManager = new CartManager()

router.post('/carts', async (req, res) => {
  try {
    await cartManager.createCart()
    res.status(201).json({ message: 'Carrito creado con exito' })
  } catch (error) {
    res.status(500).json({ error: 'Error de servidor' })
  }
})

router.get('/carts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const cart = await cartManager.getCart(id)
    res.json(cart)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

router.post('/carts/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params

  try {
    const cart = await cartManager.getCart(cid)
    const existingProductIndex = cart.products.findIndex((p) => p.product === pid)

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += 1
    } else {
      cart.products.push({ product: pid, quantity: 1 })
    }

    await cartManager.saveCartToFile(cart)
    res.json({ message: 'Producto agregado al carrito con exito' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router