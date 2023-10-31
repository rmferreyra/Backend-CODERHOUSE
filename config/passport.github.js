const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = require("./config");
const GitHubStrategy = require("passport-github2"); 
const userManager = require("../dao/user.manager");
const cartManager = require("../dao/cart.manager");
const logger = require("../logger");

const CLIENT_ID = GITHUB_CLIENT_ID;
const CLIENT_SECRET = GITHUB_CLIENT_SECRET;
const CALLBACK_URL = "http://localhost:8080/api/github/callback";

const auth = async (accessToken, refreshToken, profile, done) => {

  try {
    const {
      _json: { name, email },
    } = profile;

    logger.debug(name, email)

    if (!email) {
      console.log("el usuario no tiene su email publico");
      return done(null, false);
    }

    let user = await userManager.getByEmail(email);
    if (!user) {

      if (name === null) {
        logger.error("Usuario no tiene nombre definido en github")
      }

      const [firstname, lastname] = name.split(" ");
      const _user = await userManager.create({
        firstname,
        lastname,
        email,
        age: 38,
        gender: "Male",
        cart: await cartManager.createCart(email),
      });

      logger.debug(_user)
      user = _user._doc;
    }

    done(null, user);
  } catch (e) {
    logger.error(e)
    done(e, false);
  }
};

const gitHubHandler = new GitHubStrategy(
  {
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
  },
  auth
);

module.exports = gitHubHandler;