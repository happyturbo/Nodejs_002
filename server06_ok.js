
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

// using async, await to use bcrypt.hash
app.post('/login', async (req, res) => {
  const found = users.find(user => user.email === req.body.email)
  
  try {
    if ( found == null){
      res.redirect('/register')
    } else if (await bcrypt.compare(req.body.password, found.password )) {
      res.render('index.ejs', {name : found.name})
    } else {
      res.redirect('/login')
    }
  } catch (e) {
    res.redirect('/login')
  }

 
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
      res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.listen(3000)