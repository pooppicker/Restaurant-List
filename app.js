const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') //載入mongoose
const restaurantList = require('./restaurant.json')
const app = express()
const port = 3000

// 設定連線到 mongodb
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection
// failed to connect to mongodb
db.on('error', () => {
  console.log('mongodb error!')
})
// connect to mongodb successfully
db.once('open', () => {
  console.log('mongodb connected!')
})
// 建立名為 hbs 的樣版引擎
app.engine('handlebars', exphbs({ defaultLayout: 'main', extname: '.hbs'}))
// 啟用樣版引擎
app.set('view engine', 'hbs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', {restaurants: restaurantList.results})
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', {restaurant: restaurant})
})

app.get('/restaurants/searches', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', {restaurants: restaurants, keyword: keyword})
})

app.listen(port, () => {
  console.log(`Express listening on localhost:${port}`)
})