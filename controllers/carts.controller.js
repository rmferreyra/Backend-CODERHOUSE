const cartManager = require("../dao/cart.manager");

const createCart = async (req, res) => {
  try {
    const createdCart = await cartManager.createCart();
    const cartID = createdCart._id.toString();
    res
      .cookie("cartID", cartID)
      .status(201)
      .json({ message: "Carrito creado con exito", cartID: cartID });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const addProduct = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    await cartManager.addProductToCart(cid, pid);
    res.json({ message: "Producto agregado al carrito con exito" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    await cartManager.removeProductFromCart(cid, pid);
    res.json({ message: "Producto removido del carrito con exito" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAll = async (req, res) => {
  const { cid } = req.params;

  try {
    await cartManager.clearCart(cid);
    res.json({ message: "Carrito vaciado con exito" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCart = async (req, res) => {
  const { cid } = req.params;
  const updatedProducts = req.body;

  try {
    await cartManager.updateCartProducts(cid, updatedProducts);
    res.json({ message: "Carrito actualizado con exito" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProductCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    await cartManager.updateCartItemQuantity(cid, pid, quantity);
    res.json({ message: "Articulo del carrito actualizado con exito" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPopulateCart = async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManager.getCartWithPopulatedProducts(cid);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getCartByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await cartManager.getCartIdByEmail(email);
    res.json(user._id);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  createCart,
  addProduct,
  deleteProduct,
  deleteAll,
  updateCart,
  updateProductCart,
  getPopulateCart,
  getCartByEmail,
};