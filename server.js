const express = require('express')
const routes = require('./routes')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api', routes)
app.use('/api', cartsRouter)

const port = 8080

app.listen(port, () => {
  console.log(`Express Server listening at http://localhost:${port}`)
})