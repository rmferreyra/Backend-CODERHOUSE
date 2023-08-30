const express = require('express')
const router = express.Router()
const cartManager = require('../../dao/cart.manager')

router.post('/carts', async (req, res) => {
  try {
    const createdCart = await cartManager.createCart()
    const cartID = createdCart._id.toString()
    res.cookie('cartID', cartID).status(201).json(
      { message: 'Carrito creado con exito',
        cartID: cartID
      })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/carts/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params

  try {
    await cartManager.addProductToCart(cid, pid)
    res.json({ message: 'Producto agregado al carrito con exito' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/carts/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params

  try {
    await cartManager.removeProductFromCart(cid, pid)
    res.json({ message: 'Producto eliminado del carrito con exito' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/carts/:cid', async (req, res) => {
  const { cid } = req.params

  try {
    await cartManager.clearCart(cid)
    res.json({ message: 'Carrito limpio con exito' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put('/carts/:cid', async (req, res) => {
  const { cid } = req.params
  const updatedProducts = req.body

  try {
    await cartManager.updateCartProducts(cid, updatedProducts)
    res.json({ message: 'Carrito actualizado con exito' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put('/carts/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params
  const { quantity } = req.body

  try {
    await cartManager.updateCartItemQuantity(cid, pid, quantity)
    res.json({ message: 'Cantidad de productos actualizado en el carrito con exito' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/cart/:cid', async (req, res) => {
  const { cid } = req.params

  try {
    const cart = await cartManager.getCartWithPopulatedProducts(cid)
    res.json(cart)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

module.exports = router