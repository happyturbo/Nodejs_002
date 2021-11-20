
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

// --------------- new passport and passport-local for the passport policy.
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

const authenticateUser = async (email, password, done) => {
  const eUser = users.find(user => user.email === email)
  if (eUser == null) {
    return done(null, false, { message: 'No user with that email' })
  }

  try {
    if (await bcrypt.compare(password, eUser.password)) {
      return done(null, eUser)
    } else {
      return done(null, false, { message: 'Password incorrect' })
    }
  } catch (e) {
    return done(e)
  }
}
passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))


//--------------------------------------------------------------------------------------------

const users = []
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())

app.get('/', (req, res) => {
  res.render('index.ejs', {name : 'nobody'})
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.get('/register', (req, res) => {
  res.render('register.ejs')
})

app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/register' } ) );

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const dbIndex = Date.now().toString() 

    users.push({
      id: dbIndex,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
      res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.listen(3000)