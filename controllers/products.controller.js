const productManager = require("../dao/product.manager")
const { CustomError, ErrorType } = require("../errors/custom.error")
const productModel = require("../models/product.model")

const getAll = async (req, res, next) => {
  try {
    const { search, max, min, limit } = req.query
    logger.debug(`Searching products for ${search} max ${max} and min ${min}`)

    const products = await productManager.getProducts()

    let filtrados = products
    if (search) {
      filtrados = filtrados.filter(
        (p) =>
          p.keywords.includes(search.toLowerCase) ||
          p.title.includes(search.toLowerCase) ||
          p.description.includes(search.toLowerCase)
      )
    }

    if (min || max) {
      filtrados = filtrados.filter(
        (p) => p.price >= (min || 0) && p.price <= (max || Infinity)
      )
    }

    if (limit) {
      filtrados = filtrados.slice(0, limit)
    }
    await res.send(filtrados)
  } catch (error) {
    next(new CustomError("No se pudo obtener productos de la Base de Datos", ErrorType.DB))
  }
}

const getAllMNock = async (req, res, next) => {
  try {
    const products = await productManager.getMockProducts()
    res.send(products)
  } catch (error) {
    next(
      new CustomError("No se pudo obtener productos mockeados", ErrorType.DB)
    )
  }
}

const getById = async (req, res, next) => {
  try {
    const id = req.params.id
    const products = await productManager.getProductById(id)

    if (!products) {
      next(new CustomError("No se pudo obtener producto por ID", ErrorType.DB))
    }
    res.send(products)
  } catch {
    next(new CustomError("No se pudo obtener producto por ID", ErrorType.DB))
  }
}

const create = async (req, res, next) => {
  try {
    const product = req.body
    await productManager.addProduct(product)
    res.status(201).json({ message: "Producto agregado con exito" })
  } catch (error) {
    next(new CustomError("No se pudo crear el producto", ErrorType.DB))
  }
}

const updateById = async (req, res, next) => {
  try {
    const { id } = req.params
    const updatedFields = req.body
    const result = await productManager.updateProduct(id, updatedFields)
    res.json({ message: "Producto actualizado con exito" })
  } catch (error) {
    next(new CustomError("No se pudo actualizar el producto", ErrorType.DB))
  }
}

const deleteById = async (req, res, next) => {
  try {
    const { id } = req.params
    await productManager.deleteProduct(id)
    res.status(200).send("Producto eliminado con exito")
  } catch {
    //res.status(404).send("Product not found")
    //return
    next(new CustomError("No se pudo borrar el producto", ErrorType.DB))
  }
}

const getBase = async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query
  logger.debug(limit, page, sort, query)
  const filters = {}

  if (query) {
    filters.$or = [
      { title: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
    ]
  }

  if (sort === "asc") {
    sortObj = { price: 1 }
  } else if (sort === "desc") {
    sortObj = { price: -1 }
  } else {
    sortObj = {}
  }

  const productsPerPage = parseInt(limit)
  const currentPage = parseInt(page)

  const totalCount = await productModel.countDocuments(filters)
  const totalPages = Math.ceil(totalCount / productsPerPage)
  const hasPrevPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  try {
    const products = await productModel
      .find(filters)
      .sort(sortObj)
      .skip((currentPage - 1) * productsPerPage)
      .limit(productsPerPage)

    res.status(200).json({
      status: "success",
      payload: products,
      totalPages,
      prevPage: hasPrevPage ? currentPage - 1 : null,
      nextPage: hasNextPage ? currentPage + 1 : null,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage
        ? `/api/products?limit=${limit}&page=${
            currentPage - 1
          }&sort=${sort}&query=${query}`
        : null,
      nextLink: hasNextPage
        ? `/api/products?limit=${limit}&page=${
            currentPage + 1
          }&sort=${sort}&query=${query}`
        : null,
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      payload: products,
      totalPages,
      prevPage: hasPrevPage ? currentPage - 1 : null,
      nextPage: hasNextPage ? currentPage + 1 : null,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage
        ? `/api/products?limit=${limit}&page=${
            currentPage - 1
          }&sort=${sort}&query=${query}`
        : null,
      nextLink: hasNextPage
        ? `/api/products?limit=${limit}&page=${
            currentPage + 1
          }&sort=${sort}&query=${query}`
        : null,
    })
  }
}

module.exports = {
  getAll,
  getAllMNock,
  getById,
  create,
  updateById,
  deleteById,
  getBase,
}