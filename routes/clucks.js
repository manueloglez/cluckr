const knex = require('../db/client')
const router = require('express').Router()

router.get('/new', (req, res) => { // The route is prepended already with /articles
  res.render('create')
})

router.get('/', (req, res) => {
  knex('clucks')
  .orderBy('created_at', 'DESC')
  .then(clucks => res.render('index', { clucks }))
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
    res.redirect('/sign_in')
  }
})

module.exports = router