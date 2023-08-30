const express = require('express')
const router = express.Router()
const productManager = require('../../dao/product.manager')
const cartManager = require('../../dao/cart.manager')
const userManager = require('../../dao/user.manager')
const { hashPassword, isValidPassword} = require('../utils/passwords.utils')

const passport = require('passport')

router.get('/', async (req,res)=>{
  if(req.session.user){
    const userSession = req.session.user
    const player={
      title: 'Home',
      firstname: userSession.firstname,
      user: userSession.user,
      admin: userSession.admin
    }
    if (player.admin===true||player.user===true){
      res.redirect('/products')
      }
  } else{
    res.redirect('/login')
  }
})

router.get('/signup', async (req,res)=>{
  res.render('signup',{
    style:'index.css',
  })
})

const signup = async (req, res) => {
  let user=req.body
  let checker = await userManager.getByEmail(user.email)
  
  if(checker){
    return res.render('signup',{
      error: 'El email ya existe'
    })
  }
  if(user.password !== user.password2){
    return res.render('signup', {
      error: 'Las contraseñas no coinciden'
    })
  }
  try{
    const newUser = await userManager.create({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      age: user.age,
      password: hashPassword(user.password)
    })
    
    req.session.user ={
      firstname: newUser.firstname,
      id: newUser._id,
      ...newUser._doc
    }
    req.session.save((err) => {
      res.status(201).redirect('/')
    })
  }catch(error){
    return res.render('signup', {
      error: 'Ha ocurrido un error. Intentalo de nuevo mas tarde'
    })
  }
}

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup'
}))

router.get('/login', async (req,res)=>{
  res.render('login',{
    style:'index.css',
  })
})

const login = async (req, res) => {
  const email = req.body.email

  if(email == 'admin@coder.com'){
    const password = req.body.password
    if(password == 'admin1234'){
      req.session.user = {
        firstname: 'Coder',
        lastname: 'House',
        email: email,
        age: 25,
        user: true,
        admin: true,
      }
      req.session.save((err) => {
        if(err) {
          console.error('Error al guardar la sesion:', err)
        }else{
          console.log('La sesion se guardo con exito')
          res.redirect('/')
        }
      })
    }else{
      const user = await userManager.getByEmail(email)
      if (!user) {
        return res.render('login', { 
          error: 'El usuario no existe' 
        })
      }
    }
  }else{
      try {
        const user = await userManager.getByEmail(email)
        const password = req.body.password

        if (!user) {
          return res.render('login', { 
            error: 'El usuario no existe' 
          })
        }
        if (!password){
          return res.render('login', { 
            error: 'Password requerido' 
          })
        }
        if(!isValidPassword(password, user.password)){
          return res.render('login', { 
            error: 'Contraseña incorrecta' 
          }) 
        }

        req.session.user = {
          firstname: user.firstname,
          user: user.user,
          admin: user.admin,
          ...user
        }
        req.session.save((err) => {
          if(err) {
            console.error('Error al guardar la sesion:', err)
          }else{
            console.log('La sesion se guardo con exito')
            res.redirect('/')
          }
        })
      } catch(e) {
        res.render('login', { error: 'Ha ocurrido un error' })
      }
}}

router.post('/login', passport.authenticate('local-login', {
  failureRedirect: '/login'
}), async (req,res) => {
  if(!req.user) returnres.status(400).send({status:'error', error:"Credenciales incorrectas"})
  req.session.user = {
    firstname: req.user.firstname,
    user: req.user.user,
    admin: req.user.admin,
    ...req.user
  }
  req.session.save((err) => {
    if(err) {
      console.error('Error al guardar la sesion:', err)
    }else{
      console.log('La sesion se guardó con exito')
    }
  })
  res.redirect(('/'))
}) 


router.get('/logout', (req, res) => {

  res.clearCookie('user')
  res.clearCookie('cartID')
  req.session.destroy((err) => {
    if(err) {
      console.error('Error al borrar la sesion', err)
    }

    res.render('login', {
    })

    req.user = null
  })
})

router.get('/profile', (req, res) => {

  if (req.session.user.admin===true||req.session.user.user===true){
    res.render('profile', {
      style:'index.css',
      isAdmin: req.session.user.admin===true,
      isUser: req.session.user.user===true,
      ...req.session.user
    })
  }else{
    res.redirect('/login')
  }
})

router.get('/chat', (req, res) => {
  let testUser={
    name:"Rodolfo",
    lastName:"Ferreyra",
    admin: true,
    user: true,
  }
  
  res.render('chat',{
    user:testUser,
    style:'index.message.css',
    isAdmin:testUser.role==="admin",
  })
})

router.get('/products', async (req, res) => {
  const userSession = req.session.user
  const userId = req.session.user._id

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  try {
    const products = await productManager.getProducts()
    const cartId = cartManager.getCartIdFromCookie(req, userId)
    const totalPages = Math.ceil(products.length / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = products.slice(startIndex, endIndex)


    const player={
      title: 'Products',
      user: userSession.user,
      admin: userSession.admin
    }
    
    res.render('products', {
      firstname: userSession.firstname,
      email: userSession.email,
      style: 'index.css',
      isAdmin: player.admin === true,
      isUser: player.user === true,
      products: paginatedProducts,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      cartId,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/products?page=${page - 1}` : null,
      nextLink: page < totalPages ? `/products?page=${page + 1}` : null
    })
  } catch (error) {
    res.render('login', {
    })
  }
})

router.get('/cart/:cid', async (req, res) => {
  const { cid } = req.params
  const userSession = req.session.user

  try {
    const cart = await cartManager.getCartWithPopulatedProducts(cid)

    const player={
      title: 'Cart',
      user: userSession.user,
      admin: userSession.admin
    }
    res.render('cart', {
      firstname: userSession.firstname,
      style: 'index.cart.css',
      isAdmin: player.admin === true,
      isUser: player.user === true,
      cart
    })
  } catch (error) {
    return res.render('cart'),{
      error: "El carrito está vacio"
    }
  }
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