
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

// new array for user table
const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.render('index.ejs', {name : 'nobody'})
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.get('/register', (req, res) => {
  res.render('register.ejs')
})


app.post('/login', (req, res) => {
  const hashedPassword =  bcrypt.hash(req.body.password, 10)
  const found = users.find(user => user.email === req.body.email)
  
  try {
    if ( found == null){
      res.redirect('/register')
    } else if ( bcrypt.compare(hashedPassword, found.password )) {
      res.render('index.ejs', {name : found.name})
    } else {
      res.redirect('/login')
    }
  } catch (e) {
    console.log ('hased password created by bcrypt : ' + hashedPassword)
    console.log ('hased password came from db : ' + found.password)
    res.redirect('/login')
  }

})


app.post('/register', (req, res) => {
  try {
    const hashedPassword = bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    console.log ('hased password created by bcrypt : ' + hashedPassword)
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }

})

app.listen(3000)