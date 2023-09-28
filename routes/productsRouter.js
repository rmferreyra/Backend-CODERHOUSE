const express = require("express");
const router = express.Router();
const auth = require("../utils/auth.middleware");

const {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getBase,
} = require("../controllers/products.controller.js");

router.get("/products", getAll);

router.get("/", getBase);

router.get("/products/:id", getById);

router.post("/products", auth.authorizeAdmin, create);

router.put("/products/:id", auth.authorizeAdmin, updateById);

router.delete("/products/:id", auth.authorizeAdmin, deleteById);

module.exports = router;