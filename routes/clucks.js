const knex = require('../db/client')
const router = require('express').Router()

router.get('/new', (req, res) => { // The route is prepended already with /articles
  res.render('create')
})

router.get('/', (req, res) => {
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
  knex('clucks')
  .orderBy('created_at', 'DESC')
  .then(clucks => res.render('index', { clucks, calculateTime }))
})

router.post('/new', (req, res) => {
  const { imageUrl, content } = req.body
  const username = req.cookies.username
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
  } else {
    res.render('sign_in', {error: true})
  }
})

module.exports = router