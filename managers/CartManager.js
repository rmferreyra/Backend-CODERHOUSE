const fs = require('fs/promises')
const path = require('path')

class CartManager {

  #cart = []

  constructor(filename) {
    this.filename = filename
    this.filepath = path.join(__dirname, '../data', this.filename)
  }
  
  #readFile = async () => {
    const data = await fs.readFile(this.filepath, 'utf-8')
    this.#cart = JSON.parse(data)
  }

  #writeFile = async() => {
    const data = JSON.stringify(this.#cart, null, 2)
    await fs.writeFile(this.filepath, data)
  }

  async getAll() {
    await this.#readFile()
    return this.#cart
  }

  async getById(id) {
    await this.#readFile()
    
    return this.#cart.find(p => p.id == id)
  }

  async create() {
    await this.#readFile()
    const id = (this.#cart[this.#cart.length -1]?.id || 0) + 1

    const newCart = {
      ...cart,
      id
    }
  
    this.#cart.push(newCart)
    await this.#writeFile()

    return newCart
  }

  async save(id) {
    await this.#readFile()

    const existing = await this.getById(id)

    if (!existing) {
      return
    }

    const {
      product
    } = product

    existing.product = product

    await this.#writeFile()
  }

    async delete(id) {
      await this.#readFile()

      this.#cart = this.#cart.filter(p => p.id != id)

      await this.#writeFile()

    }
  }

module.exports = CartManager