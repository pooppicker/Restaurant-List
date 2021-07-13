const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser') // 引用body-parser
const methodOverride = require('method-override') 
const app = express()
const port = 3000
const Restaurant = require('./models/restaurant')
const routes = require('./routes/index')
require('./config/mongoose')


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

app.get('/searches', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find()
    .lean()
    .then((restaurants) => {
      if (keyword) {
        restaurants = restaurants.filter((restaurant) => restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword))
      }
      if (restaurants.length === 0) {
        return res.render('index', { error: `<div class="alert alert-danger" role="alert">cannot find: "${keyword}", please search again!</div>` })
      }
      res.render('index', { restaurants, keyword })
    })
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`Express listening on http://localhost:${port}`)
})