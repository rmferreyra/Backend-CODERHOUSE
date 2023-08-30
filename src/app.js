(async () =>{
  const productsRouter = require('../src/routes/productsRouter')
  const cartsRouter = require('../src/routes/cartsRouter')
  const viewRourter = require('../src/routes/viewsRouter')
  const usersRouter = require('../src/routes/usersRouter')
  const authRouter = require('../src/routes/auth.router')
  
  const passport = require('passport')
  const initPassportLocal = require('../config/passport.local.config')
  
  const mongoose = require('mongoose')
  mongoose.connect("mongodb+srv://rmferreyra:uUeTHHZbSBN4DYVE@ferreyra.a8odytm.mongodb.net/?retryWrites=true&w=majority")
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

const session = require('express-session')

const MongoStore = require('connect-mongo')

const cookieParser = require('cookie-parser')

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

app.use(cookieParser('esunsecreto'))
app.use(session({
  secret: 'esunsecreto',
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://rmferreyra:uUeTHHZbSBN4DYVE@ferreyra.a8odytm.mongodb.net/?retryWrites=true&w=majority',
    ttl: 60 * 60
  })
}))

initPassportLocal()
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  next()
  })

app.use('/api', productsRouter)

app.use('/api', cartsRouter)

app.use('/api', usersRouter)

app.use('/api', authRouter)

app.use('/', viewRourter)
app.engine('handlebars', engine())
app.set('views',__dirname+'/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname+'/public'))
})()