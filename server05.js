
const express = require('express')
const app = express()
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

// using async, await to use bcrypt.hash
app.post('/login', async (req, res) => {
  const hashedPassword =  await bcrypt.hash(req.body.password, 10)
  var jD = {'email' : req.body.email , 'password' : hashedPassword }
  res.json (jD) 
})

// using async, await to use bcrypt.hash
app.post('/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  var jD = {'name' : req.body.name , 'email' : req.body.email, 'password' : hashedPassword }
  res.json (jD) 
})

app.listen(3000)