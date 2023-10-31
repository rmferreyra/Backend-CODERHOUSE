const passport = require("passport");
const local = require("passport-local");

const github = require("../config/passport.github");
const jwt = require("../config/passport.jwt.config");
const cartManager = require("../dao/cart.manager");
const userManager = require("../dao/user.manager");
const { hashPassword, isValidPassword } = require("../utils/passwords.utils");
const logger = require("../logger");

const LocalStrategy = local.Strategy;

const signup = async (req, email, password, done) => {
  const user = req.body;

  const _user = await userManager.getByEmail(email);

  if (_user) {
    logger.error("usuario ya existe")
    return done(null, false);
  }

  try {
    const newUser = await userManager.create({
      firstname: user.firstname,
      lastname: user.lastname,
      email: email,
      age: user.age,
      password: hashPassword(password),
      cart: await cartManager.createCart(email),
    });

    return done(null, {
      firstname: newUser.firstname,
      id: newUser._id,
      ...newUser._doc,
    });
  } catch (e) {
    logger.error("ha ocurrido un error")
    done(e, false);
  }
};
const login = async (req, email, password, done) => {
  try {
    logger.debug(email, password)
    const user = await userManager.getByEmail(email);
    logger.debug(user)
    if (!user) {
      logger.error("usuario no existe")
      return done(null, false);
    }

    if (!password) {
      return done(null, false);
    }

    if (!isValidPassword(password, user.password)) {
      logger.error("credenciales no coinciden")
      return done(null, false);
    }
    done(null, user);
  } catch (e) {
    logger.error("ha ocurrido un error")
    done(e, false);
  }
};

const init = () => {

  passport.use(
    "local-signup",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      signup
    )
  );
  passport.use(
    "local-login",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      login
    )
  );

  passport.use("github", github);

  passport.use("jwt", jwt);

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await userManager.getById(id);

    done(null, user);
  });
};

module.exports = init;