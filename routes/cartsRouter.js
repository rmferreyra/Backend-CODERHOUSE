const express = require("express");
const router = express.Router();
const auth = require("../utils/auth.middleware");
const cartManager = require("../dao/cart.manager");
const purchaseOrderManager = require(".././dao/purchase.manager");
const productManager = require("../dao/product.manager");

const {
  createCart,
  addProduct,
  deleteProduct,
  deleteAll,
  updateCart,
  updateProductCart,
  getPopulateCart,
  getCartByEmail,
} = require("../controllers/carts.controller");

router.post("/carts", createCart);

router.post("/carts/:cid/product/:pid", auth.authorizeUser, addProduct);

router.delete("/carts/:cid/products/:pid", deleteProduct);

router.delete("/carts/:cid", deleteAll);

router.put("/carts/:cid", updateCart);

router.put("/carts/:cid/products/:pid", updateProductCart);

router.get("/cart/:cid", getPopulateCart);

router.get("/carts/:email", getCartByEmail);

router.get("/:cartId/purchase", auth.authorizeUser, async (req, res) => {
  const { cartId } = req.params;
  const cart = await cartManager.getCart(cartId);
  if (!cart) {
    return res.sendStatus(404);
  }

  const { products: productsInCart } = cart;
  const products = [];

  for (const { product: id, qty } of productsInCart) {
    const p = await productManager.getProductById(id);

    if (!p.stock) {
      return;
    }

    const toBuy = p.stock >= qty ? qty : p.stock;

    products.push({
      id: p._id,
      price: p.price,
      qty: toBuy,
    });

    p.stock = p.stock - toBuy;

    await p.save();

  }

  const po = {
    user: null,
    code: null,
    total: products.reduce((total, { price, qty }) => price * qty + total, 0),
    products: products.map(({ id, qty }) => {
      return {
        product: id,
        qty,
      };
    }),
  };

  console.log(po);

  res.send(po);
});

module.exports = router;