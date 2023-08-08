const chatMessageModel = require('../models/ChatMessageModel')

class ChatMessageManager {

  getAll() {
    return chatMessageModel.find().lean()
  }

  create(message) {
    return chatMessageModel.create(message)
  }
}

module.exports = new ChatMessageManager()