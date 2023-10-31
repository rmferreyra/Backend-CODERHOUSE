const express = require("express");
const router = express.Router();
const productManager = require("../dao/product.manager");
const cartManager = require("../dao/cart.manager");
const userManager = require("../dao/user.manager");
const { hashPassword, isValidPassword } = require("../utils/passwords.utils");
const auth = require("../utils/auth.middleware");
const logger = require("../logger")

const passport = require("passport");

router.get("/", async (req, res) => {
  if (req.session.user) {
    const userSession = req.session.user;
    const player = {
      title: "Home",
      firstname: userSession.firstname,
      role: userSession.role,
      email: userSession.email,
    };
    if (player.role === "user" || player.role === "admin") {
      res.redirect("/products");
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/signup", async (req, res) => {
  res.render("signup", {
    style: "index.css",
  });
});

const signup = async (req, res) => {
  let user = req.body;
  let checker = await userManager.getByEmail(user.email);

  if (checker) {
    return res.render("signup", {
      error: "El email ya existe",
    });
  }
  if (user.password !== user.password2) {
    return res.render("signup", {
      error: "Las contraseñas no coinciden",
    });
  }
  try {
    const newUser = await userManager.create({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      age: user.age,
      password: hashPassword(user.password),
    });

    req.session.user = {
      firstname: newUser.firstname,
      id: newUser._id,
      ...newUser._doc,
    };
    req.session.save((err) => {
      res.status(201).redirect("/");
    });
  } catch (error) {
    return res.render("signup", {
      error: "Ocurrio un error. Intentalo más tarde",
    });
  }
};

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/signup",
  })
);

router.get("/login", async (req, res) => {
  res.render("login", {
    style: "index.css",
  });
});

const login = async (req, res) => {
  const email = req.body.email;

  if (email == "admin@mail.com") {
    const password = req.body.password;
    if (password == "admin1234") {
      req.session.user = {
        firstname: "Rodolfo",
        lastname: "Ferreyra",
        email: email,
        age: 9,
        role: "admin",
      };
      req.session.save((err) => {
        if (err) {
          logger.error("Error al guardar la sesión:", err)
        } else {
          logger.debug("La session se guardó exitosamente")
          res.redirect("/");
        }
      });
    } else {
      const user = await userManager.getByEmail(email);
      if (!user) {
        return res.render("login", {
          error: "El usuario no existe",
        });
      }
    }
  } else {
    try {
      const user = await userManager.getByEmail(email);
      const password = req.body.password;

      if (!user) {
        return res.render("login", {
          error: "El usuario no existe",
        });
      }
      if (!password) {
        return res.render("login", {
          error: "El password es requerido",
        });
      }
      if (!isValidPassword(password, user.password)) {
        return res.render("login", {
          error: "Contraseña invalida",
        });
      }

      req.session.user = {
        firstname: user.firstname,
        role: user.role,
        ...user,
      };
      req.session.save((err) => {
        if (err) {
          logger.error("Error al guardar la sesión:", err)
        } else {
          logger.debug("La session se guardó exitosamente")
          res.redirect("/");
        }
      });
    } catch (e) {
      res.render("login", { error: "Ha ocurrido un error" });
    }
  }
};

router.post(
  "/login",
  passport.authenticate("local-login", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    if (!req.user)
      returnres
        .status(400)
        .send({ status: "error", error: "Credenciales invalidas" });
    req.session.user = {
      firstname: req.user.firstname,
      role: req.user.role,
      cart: req.user.cart,
      ...req.user,
    };
    req.session.save((err) => {
      if (err) {
        console.error("Error al guardar la sesion:", err);
      } else {
        console.log("La sesion se guardo exitosamente");
      }
    });
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {

  res.clearCookie("user");
  res.clearCookie("cartID");
  req.session.destroy((err) => {
    if (err) {
      logger.error("Hubo problemas para borrar la session", err)
    }

    res.render("login", {});

    req.user = null;
  });
});

router.get("/profile", (req, res) => {
  if (req.session.user.role === "admin" || req.session.user.role === "user") {
    res.render("profile", {
      style: "index.css",
      isAdmin: req.session.user.role === "admin",
      isUser: req.session.user.role === "user",
      ...req.session.user,
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/chat", auth.authorizeUser, (req, res) => {
  res.render("chat", {
    style: "index.message.css",
    isUser: req.session.user.role === "user",
  });
});

router.get("/products", async (req, res) => {
  const userSession = req.session.user;
  const userId = req.session.user._id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  try {
    const products = await productManager.getProducts();
    const cartId = cartManager.getCartIdFromCookie(req, userId);
    const totalPages = Math.ceil(products.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    const player = {
      title: "Products",
      role: userSession.role,
    };
    if (player.role === "admin") {
      res.render("products", {
        firstname: userSession.firstname,
        email: userSession.email,
        style: "index.css",
        isAdmin: true,
        isUser: true,
        products: paginatedProducts,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page,
        cartId,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `/products?page=${page - 1}` : null,
        nextLink: page < totalPages ? `/products?page=${page + 1}` : null,
      });
    } else {
      res.render("products", {
        firstname: userSession.firstname,
        email: userSession.email,
        style: "index.css",
        isAdmin: false,
        isUser: true,
        products: paginatedProducts,
        totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page,
        cartId,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `/products?page=${page - 1}` : null,
        nextLink: page < totalPages ? `/products?page=${page + 1}` : null,
      });
    }
  } catch (error) {
    res.render("login", {});
  }
});

router.get("/cart/:cid", async (req, res) => {
  const { cid } = req.params;
  const userSession = req.session.user;
  try {
    const cart = await cartManager.getCartWithPopulatedProducts(cid);

    const player = {
      title: "Cart",
      role: userSession.role,
    };
    res.render("cart", {
      firstname: userSession.firstname,
      style: "index.cart.css",
      isAdmin: player.role === "admin",
      isUser: player.role === "user",
      cart,
    });
  } catch (error) {
    return (
      res.render("cart"),
      {
        error: "No tenes permisos para ver el carrito de compras",
      }
    );
  }
});

router.get("/realtimeproducts", async (req, res) => {
  let testUser = {
    name: "Rodolfo",
    lastName: "Ferreyra",
    role: "admin",
  };

  const products = await productManager.getProducts();

  res.render("realTimeProducts", {
    user: testUser,
    style: "index.css",
    isAdmin: testUser.role === "admin",
    products,
  });
});

router.post("/realTimeProducts", async (req, res) => {
  newProduct = req.body;
  try {
    await productManager.addProduct(newProduct);
    res.status(201).redirect("/realTimeProducts");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/managment", async (req, res) => {
  const userSession = req.session.user;
  const products = await productManager.getProducts();

  const player = {
    title: "Home",
    firstname: userSession.firstname,
    role: userSession.role,
    email: userSession.email,
  };
  if (player.role === "admin") {
    res.render("managment", {
      firstname: userSession.firstname,
      email: userSession.email,
      style: "index.css",
      isAdmin: true,
      isUser: true,
      products,
    });
  } else {
    res.redirect("/products");
  }
});

router.get("/loggerTest", (req, res) => {

  logger.error("Este es un mensaje de nivel error")
  logger.warn("Este es un mensaje de nivel warn")
  logger.info("Este es un mensaje de nivel info")
  logger.http("Este es un mensaje de nivel http")
  logger.debug("Este es un mensaje de nivel debug")

  res.send("Mensajes de logger enviados")
})

module.exports = router;