
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const users = []

// --------------- passport and passport-local .
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
  },
  async(email, password, done) => {
       
     email = email.toLowerCase();
     // check DB
     const found = users.find(user => user.email === email)
  
    try {
      if ( found == null){
        return done(null, false, { message: 'No user with that email' })
      } else if (await bcrypt.compare(password, found.password )) {
        return done(null, found)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
  }
  }
));

app.use(passport.initialize())
//-------------------------------------------------------------------------------------

//----------------- For Session ------------------------------------------------------
const session = require('express-session') 

app.use(session({ secret: 'any string for seed', resave: false, saveUninitialized: false }))
app.use(passport.session())

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => {
  return done(null, getUserById(id))
})
// ------------------------------------------------------------------------------------------


//------------------ log out ------------------------
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
//---------------------------------------------------

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
// app.use(flash())

app.get('/', (req, res) => {
  res.render('index.ejs', {name : 'steve'})
})

app.get('/login', (req, res) => {
    // ------  Temporary code to check seesion authenticated    
    if (req.isAuthenticated()){
      console.log('Authenticated : true')
    }else{
      console.log('Authenticated : false')
    }
    // ------------------------------------------------------
  res.render('login.ejs')
})

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
    
    console.log ( dbIndex)
    console.log ( req.body.name)
    console.log ( req.body.email)
    console.log ( hashedPassword)

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