const express = require('express')
const router = express.Router()
const productManager = require('../../dao/ProductManager')

router.get('/', async (req,res)=>{
  let testUser={
    name:"Rodolfo",
    lastName:"Ferreyra",
    role:"admin"
  }

  const products = await productManager.getProducts()

  res.render('index',{
    user:testUser,
    style:'index.css',
    isAdmin:testUser.role==="admin",
    products
  })
})

router.get('/chat', (req, res) => {
  let testUser={
    name:"Rodolfo",
    lastName:"Ferreyra",
    role:"admin"
  }
  
  res.render('chat',{
    user:testUser,
    style:'index.message.css',
    isAdmin:testUser.role==="admin",
  })
})


router.get('/realtimeproducts', async (req,res)=>{
  let testUser={
    name:"Rodolfo",
    lastName:"Ferreyra",
    role:"admin"
  }

  const products = await productManager.getProducts()

  res.render('realTimeProducts',{
    user:testUser,
    style:'index.css',
    isAdmin:testUser.role==="admin",
    products
  })
})

router.post('/realTimeProducts', async (req, res) => {
    newProduct=req.body
    try {
      await productManager.addProduct(newProduct)
      res.status(201).redirect('/realTimeProducts')
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  })

module.exports = router