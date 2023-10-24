const chatMessageManager = require('../dao/chat.message.manager')
const logger = require("../logger")
async function socketManager(socket) {
  logger.debug(`user has connected: ${socket.id}`)

  const messages = await chatMessageManager.getAll()
  socket.emit('chat-messages', messages)

  socket.on('chat-message', async (msg) => {
    await chatMessageManager.create(msg)
    socket.broadcast.emit('chat-message', msg)
  })
}

module.exports = socketManager