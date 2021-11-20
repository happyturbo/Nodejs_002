
const express = require('express')
const app = express()

app.set('view-engine', 'ejs')
// New for url parsing
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

// New for responding login post req
app.post('/login', (req, res) => {
  var jD = {'email' : req.body.email , 'name' : req.body.password }
  res.json (jD) 
})

// New for responding login post req
app.post('/register', (req, res) => {
  var jD = {'name' : req.body.name , 'email' : req.body.email, 'pass' : req.body.password }
  res.json (jD) 
})

app.listen(3000)