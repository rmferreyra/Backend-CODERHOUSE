const express = require('express')
const router = express.Router()
const ProductManager = require('../../dao/ProductManager')
const productManager = new ProductManager('productos.json')

router.get('/products', async (req, res) => {
  const { search, max, min, limit } = req.query
  console.log(`Searching products for ${search} max ${max} and min ${min}`)

  const products = await productManager.getProducts()

  let filtrados = products
  if (search){
    filtrados = filtrados
    .filter(p => p.keywords.includes(search.toLowerCase) || p.title.includes(search.toLowerCase) || p.description.includes(search.toLowerCase))
  }

  if (min || max) {
    filtrados = filtrados.filter(p => p.price >= (min || 0) && p.price <= (max || Infinity))
  }

  if(limit) {
    filtrados = filtrados.slice(0, limit)
  }

  await(res.send(filtrados))
})
router.get('/products/:id', async (req, res) => {
  const id = req.params.id
  
  const products = await productManager.getProducts()

  for (const p of products){
    if (p.id == id){
      res.send(p)
      return
    }
  }
  await(res.send('Product not found'))
})

router.post('/products', async (req, res) => {
  const product = req.body

  try {
    await productManager.addProduct(product)
    res.status(201).json({ message: 'Producto agregado con exito' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put('/products/:id', async (req, res) => {
  const { id } = req.params
  const updatedFields = req.body

  try {
    await productManager.updateProduct(id, updatedFields)
    res.json({ message: 'Producto actualizado con exito' })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

router.delete('/products/:id', async (req, res) => {
  const { id } = req.params

  try {
    await productManager.deleteProduct(id)
    res.json({ message: 'Producto eliminado con exito' })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

module.exports = router