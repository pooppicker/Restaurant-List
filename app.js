const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') //載入mongoose
const Restaurant = require('./models/restaurant') //載入Restaurant model
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
//靜態檔案放在public資料夾裡
app.use(express.static('public'))
//設定路由
app.get('/', (req, res) => {
  Restaurant.find() //取出 Restaurant model 裡所有資料
    .lean() //把 Mongoose 的 Model 物件轉換成乾淨的JS資料陣列
    .then((restaurants) => res.render('index'), { restaurants }) //將資料傳給index template
    .catch(error => console.log(error)) //除錯
})

app.get('/restaurants/searches', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', {restaurant: restaurant})
})

app.listen(port, () => {
  console.log(`Express listening on localhost:${port}`)
})