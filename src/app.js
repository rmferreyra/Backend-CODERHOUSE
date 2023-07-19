const express = require('express')
const app = express()
const productsRouter = require('../src/routes/productsRouter')
const cartsRouter = require('../src/routes/cartsRouter')
const viewRourter = require('../src/routes/viewsRouter')
const { engine } = require('express-handlebars')
const {Server} = require("socket.io")
const http =require('http')
const server =http.createServer(app)
const io = new Server(server)

const port = 8080
server.listen(port, () => {
  console.log(`Express Server Listening at http://localhost:${port}`)
})
io.on('connection', socket =>{
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