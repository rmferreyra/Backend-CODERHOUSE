const { Router } = require("express")
const passport = require("passport")
const logger = require("../logger")

const userManager = require("../dao/user.manager")
const { generateToken } = require("../utils/jwt.utils")
const { isValidPassword } = require("../utils/passwords.utils")

const router = Router()

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (req, res) => {}
)

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user

    req.session.save((err) => {
      if (!err) {
        return res.redirect("/")
      }

      logger.error(err)
      res.redirect("/login")
    })
  }
)

router.post("/login", async (req, res) => {
  const { email, password } = req.body
  logger.debug(email, password)

  try {
    const user = await userManager.getByEmail(email)

    if (!user || !isValidPassword(password, user?.password)) {
      logger.error("No coincide el password")
      return res.status(401).send({
        status: "failure",
        error: "Failed login",
      })
    }

    const token = generateToken(user)

    return res
      .cookie("jwtToken", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .send({
        status: "success",
        message: token,
      })
  } catch (error) {
    logger.error(error)
    res.status(500).send({
      status: "failure",
      error,
    })
  }
})

router.get(
  "/user",
  (req, res, next) => {
    const auth = passport.authenticate(
      "jwt",
      { session: false },
      (err, user, info) => {
        logger.error(err, user, info)
        if (err)
          return res.status(500).send({
            error: err,
            status: "failure",
          })

        if (!user) {
          return res.status(401).send({
            error: info.message,
            success: "failure",
          })
        }

        req.user = user
        next()
      }
    )

    try {
      auth(req, res, next)
    } catch {
      return res.status(401).send({
        error: "Token invalido",
        success: "failure",
      })
    }
  },
  (req, res) => {
    res.sendStatus(200)
  }
)

module.exports = router