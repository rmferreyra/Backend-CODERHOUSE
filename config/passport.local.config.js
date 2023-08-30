const passport = require('passport')
const local = require('passport-local')

const github = require('../config/passport.github')
const jwt = require('../config/passport.jwt.config')

const userManager = require('../dao/user.manager')
const {hashPassword, isValidPassword} = require('../src/utils/passwords.utils')

const LocalStrategy = local.Strategy

const signup = async (req, email, password, done) => {
  const user = req.body

  const _user = await userManager.getByEmail(email)
  
  if (_user) {
    console.log('Usuario existente')
    return done(null, false)
  }

  try {
    const newUser = await userManager.create({
      firstname: user.firstname,
      lastname: user.lastname,
      email: email,
      age: user.age,
      password: hashPassword(password)
    })

    return done(null, {
      firstname: newUser.firstname,
      id: newUser._id,
      ...newUser._doc
    })

  } catch(e) {
    console.log('Ha ocurrido un error')
    done(e, false)
  }
}
const login = async (req, email, password, done) => {
  try {
    console.log(email, password)
    const user = await userManager.getByEmail(email)

    if (!user) {
      console.log('Usuario inexistente')
      return done(null, false)
    }

    if (!password) {
      return done(null, false)
    }

    if(!isValidPassword(password, user.password)) {
      console.log('Credenciales no coinciden')
      return done(null, false)
    }
    done(null, user)
  } catch(e) {
    console.log('Ha ocurrido un error')
    done(e, false)
  }

}

const init = () => {
  passport.use('local-signup', new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, signup))
  passport.use('local-login', new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, login))
  passport.use('github', github)
  passport.use('jwt', jwt)
  
  
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  passport.deserializeUser(async (id, done) => {
    const user = await userManager.getById(id)

    done(null, user)
  })
}

module.exports = init