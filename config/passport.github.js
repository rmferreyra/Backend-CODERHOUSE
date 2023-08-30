const GitHubStrategy = require('passport-github2')
const userManager = require('../dao/user.manager')

const CLIENT_ID = "Iv1.6704a6ecc19d2cca"
const CLIENT_SECRET = "1718a748c2ae12bdc44b3f62290e23b9cb4377fa"
const CALLBACK_URL = 'http://localhost:8080/githubSessions'

const auth = async (accessToken, refreshToken, profile, done) => {

    try {
        console.log(profile)

        const { _json: { name, email } } = profile

        console.log(name, email)

        if (!email) {
            console.log('El usuario no tiene su email publico')
            return done(null, false)
        }

        let user = await userManager.getByEmail(email)

        if (!user) {
            const [ firstname, lastname] = name.split(' ')
            const _user = await userManager.create({
                firstname,
                lastname,
                email,
                age: 25,
                gender: 'Male'
            })

            user = _user._doc
        }
        
        done(null, user)
    } catch (e) {
        console.log(e)
        done(e, false)
    }

}

const gitHubHandler = new GitHubStrategy(
    {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: CALLBACK_URL
    },
    auth
)

module.exports = gitHubHandler