const express = require('express');
const path = require('path')
const logger = require('morgan');
const cookieParser = require('cookie-parser')
const cluckRouter = require('./routes/clucks')

const app = express();
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(logger('dev'))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")));

// middleware to use the username in every view
app.use((request, response, next) => {
  const { username } = request.cookies
  response.locals.username = username
  next()
})

// route for clucks
app.use('/clucks', cluckRouter)

app.get('/', (req, res) => {
  res.redirect('/clucks')
})

// error key is for displaying a message if the user is trying to cluck without logging in
app.get('/sign_in', (req, res) => {
  res.render('sign_in', {error: false})
})

const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 // cookies for 1 day
app.post('/sign_in', (req, res) => {
  const { username } = req.body
  res.cookie('username', username, { maxAge: COOKIE_MAX_AGE})
  res.redirect('/')
})

app.post('/sign_out', (request, response) => {
  response.clearCookie('username')
  response.redirect('/')
})

const PORT = 3000;
const DOMAIN = 'localhost'

app.listen(PORT, DOMAIN, ()=>{
    console.log(`Server is listening in port ${PORT}`)
})