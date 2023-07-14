const express = require('express')
const routes = require('./routes')
// const { aumentaContador } = require('./middlewares')
// const path = require('path')
// const router = require('./routes/home.router')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use('/static', express.static(path.join(__dirname, 'public')))
// app.use(aumentaContador)

// app.use('/', home) 
app.use('/api', routes)

const port = 8080

app.listen(port, () => {
  console.log(`Express Server listening at http://localhost:${port}`)
})