/* On initialise le passport*/
const LocalStrategy = require('passport-local').Strategy

/*On invok bcrypt*/
const bcrypt = require('bcrypt')


function initialize(passport, getUserByEmail) {
    const authenticateUser = async (email, password, done) =>{
        /*on teste les authentification des Users*/
        const user = getUserByEmail(email)
        if (user == null) {
            return done(null, false, {message: 'No user with that email'})
        }
        try{
            if(await bcrypt.compare(password, user.password))
            {
                return done(null, user)
            } else {
                return done(null, false, {message: 'Password incorrect'})
            }
        } catch (e) {
            return done(e)
        }

}

    passport.use(new LocalStrategy({ usernameField: 'email'},
     authenticateUser))
    passport.serilizeUser((user, done) => {})
    passport.deserializeUser((id, done) => {})
}

module.exports = initialize