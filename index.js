const express = require('express');
const path = require('path')
const logger = require('morgan');
const knex = require("./db/client");
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const cluckRouter = require('./routes/clucks')

const app = express();
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(logger('dev'))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")));

app.use((request, response, next) => {
  const { username } = request.cookies
  response.locals.username = username
  next()
})

app.use('/clucks', cluckRouter)

app.use(methodOverride((request, response) => {
  const method = request.body._method
  delete request.body._method
  return method
}))

app.get('/', (req, res) => {
  res.redirect('/clucks')
})

app.get('/sign_in', (req, res) => {
  res.render('sign_in', {error: false})
})

const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30 // number of milliseconds in 30 days
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