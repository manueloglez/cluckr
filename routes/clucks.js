const knex = require('../db/client')
const router = require('express').Router()

router.get('/new', (req, res) => {
  res.render('create')
})

router.get('/', (req, res) => {
  // This function is to display the correct human friendly time
  const calculateTime = (date) =>{
    const current = new Date()
    const diff = current - date
    const minute = 1000*60
    const hour = minute * 60
    const day = hour * 24
    const divider = diff > day ? [day, 'day'] :
    diff > hour ? [hour, 'hour'] :
    diff > minute ? [minute, 'minute'] : null
    if (!divider) {
      return 'Just Now'
    } else {
      const num = Math.round(diff/divider[0])
      const text = num > 1 ? divider[1] + 's' : divider[1]
      return `${num} ${text} ago`
    }
  }
  // we pase the function calculateTime for use inside the view
  knex('clucks')
  .orderBy('created_at', 'DESC')
  .then(clucks => res.render('index', { clucks, calculateTime }))
})

router.post('/new', (req, res) => {
  const { imageUrl, content } = req.body
  const username = req.cookies.username
  // we check if user is logged in
  if (username) {
    knex('clucks')
    .insert({
      username,
      content,
      image_url: imageUrl,
    }, '*')
    .then(data => {
      console.table(data)
      res.redirect('/clucks')
    })
  // if not, will be redirected to log in with error message
  } else {
    res.render('sign_in', {error: true})
  }
})

module.exports = router