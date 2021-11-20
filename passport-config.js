const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => {
    console.log ( 'stop point 1 - writing user id into session ' + user.id ) 
     done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    console.log ( 'stop point 2 - reading user id from session ' + id ) 
    return done(null, getUserById(id))
  })
}

module.exports = initialize