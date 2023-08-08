(async () =>{
  const productsRouter = require('../src/routes/productsRouter')
  const cartsRouter = require('../src/routes/cartsRouter')
  const viewRourter = require('../src/routes/viewsRouter')
  const mongoose = require('mongoose');
  mongoose.connect("mongodb+srv://gnigrinis:P72FtiVO5nvaGCwn@cluster0.zt1wb.mongodb.net/ecommerce?retryWrites=true&w=majority")
  .then(() => console.log('se ha conectado a la base de datos'))
  .catch(() => console.log('no se ha conectado a la base de datos'))
  const express = require('express')
  const app = express()
  const { engine } = require('express-handlebars')
  const {Server} = require("socket.io")
  const http =require('http')
  const server =http.createServer(app)
  const io = new Server(server)
  const socketManager = require('../src/websocket/chat.socket')
  io.on('connection', socketManager)
  
  const port = 8080
  server.listen(port, () => {
    console.log(`Express Server Listening at http://localhost:${port}`)
  })
  io.on('connection', socket=>{
    
    console.log(`Cliente Conectado: ${socket.id}`)
    
    socket.on('disconnect', ()=>{
      console.log('Cliente Desconectado')
    })
    
    socket.on('addProduct', ()=>{
      console.log('Producto agregado')
    })
  })
  
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  
  app.use('/api', productsRouter)
  
  app.use('/api', cartsRouter)
  
  app.use('/', viewRourter)
  app.engine('handlebars', engine())
  app.set('views',__dirname+'/views')
  app.set('view engine', 'handlebars')
  
  app.use(express.static(__dirname+'/public'))
  })()
  
  