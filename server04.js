
const express = require('express')
const app = express()
// New object for password encryption
const bcrypt = require('bcrypt')

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

// post respond using password encryption
app.post('/login', (req, res) => {
  const hashedPassword = bcrypt.hash(req.body.password, 10)
  var jD = {'email' : req.body.email , 'password' : hashedPassword }
  res.json (jD) 
})

// post respond using password encryption
app.post('/register', (req, res) => {
  const hashedPassword = bcrypt.hash(req.body.password, 10)
  var jD = {'name' : req.body.name , 'email' : req.body.email, 'password' : hashedPassword }
  res.json (jD) 
})

app.listen(3000)