const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Campground = require('./models/campground')
const methodOverride = require('method-override')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db=mongoose.connection
db.on("error", console.error.bind(console, "connection error: "))
db.once("open", () => {
  console.log("Database connected")
})

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded( {extended: true} ))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.render('home')

})

//index
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
})

//new - needs to go before show because show will treat "new" as ":id"
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})

//endpoint where form is submitted to
app.post('/campgrounds', async (req, res) => {
  console.log(req.body)
  //need req.body.campground because in our forms we named the fields campground[title]
  const newCampground = new Campground(req.body.campground)
  await newCampground.save()
  res.redirect(`/campgrounds/${newCampground._id}`)
})

//show
app.get('/campgrounds/:id', async(req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  res.render('campgrounds/show', { campground })
})

//edit - gets the edit form
app.get('/campgrounds/:id/edit', async(req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  res.render('campgrounds/edit', { campground })
})

//edit PUT updates the data
app.put('/campgrounds/:id', async (req, res) => {
   const { id } = req.params
   const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true})
   res.redirect(`/campgrounds/${campground._id}`)
})

//delete
app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params
  const deletedCampground = await Campground.findByIdAndDelete(id)
  res.redirect('/campgrounds')
})


app.listen(3000, () => {
  console.log("LISTENING ON 3000")
})
