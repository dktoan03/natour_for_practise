const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require(`./../../models/tourModel`)
const Review = require(`./../../models/reviewModel`)
const User = require(`./../../models/userModel`)

dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => {
    console.log('DB connection established')
  })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'))

const importData = async () => {
  try {
    await Tour.create(tours)
    await User.create(users, { validateBeforeSave: false })
    await Review.create(reviews)

    console.log('data successfully created')
  } catch (err) {
    console.log(err)
  } finally {
    process.exit()
  }
}

const deleteData = async () => {
  try {
    await Tour.deleteMany()
    await User.deleteMany()
    await Review.deleteMany()
    console.log('data successfully deleted', Tour)
  } catch (err) {
    console.log(err)
  } finally {
    process.exit()
  }
}
if (process.argv[2] === '--delete') {
  deleteData()
} else if (process.argv[2] === '--import') {
  importData()
}
console.log(process.argv)
