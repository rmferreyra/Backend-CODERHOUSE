const { Router } = require("express");
const mailSenderService = require("../services/mail.sender.service");
const smsSenderService = require("../services/sms.sender.service")

const router = Router()

router.get('/mail', (req, res) => {
  
  const template = `

    <p>Tu pedido en la tienda</p>
    
    <ol>
      <li>Producto 1</li>
      <li>Producto 2</li>
    </ol>

    <p>Tiene status <span>Pendiente</span></p>

  `
  
  mailSenderService.send('rmferreyra@gmail.com',template)

  res.send('OK')
})


router.get('/sms', (req, res) =>{
  smsSenderService.send('+5492615936269', 'Hola, estamos en vivo, en la clase')
  res.send('OK')
})

module.exports = router