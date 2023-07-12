import http from 'http';

const server = http.createServer((req, res) => {
  console.log('Nueva peticion')
  res.statusCode = 200

  res.end('Saludos')
})

const port = 8080
server.listen(port, () => {
  console.log(`Express Server listening at http://localhost:${port}`)
})