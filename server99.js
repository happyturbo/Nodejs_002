
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session') 
const methodOverride = require('method-override')

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

passport.serializeUser((user, done) => {
  console.log ( 'stop point 1 - writing user id into session ' + user.id ) 
   done(null, user.id)
})

passport.deserializeUser((id, done) => {
  console.log ( 'stop point 2 - reading user id from session ' + id ) 
  const iUser = users.find(user => user.id === id)
  return done(null, iUser)
})

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({ secret: 'any string for seed', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


app.get('/', (req, res) => {
  res.render('index.ejs', {name : 'steve'})
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/register' } ) );

app.get('/register', (req, res) => {
    // ------  Temporary code to check seesion authenticated    
    if (req.isAuthenticated()){
      console.log('Authenticated : true')
    }else{
      console.log('Authenticated : false')
    }
    // ------------------------------------------------------
  res.render('register.ejs')
})

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
    console.log ( 'stop point 3 - dbIndex created by registeration : ' + dbIndex)
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }

})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

app.listen(3000)