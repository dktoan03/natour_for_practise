const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require(`./../../models/tourModel`)

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

const importData = async () => {
  try {
    await Tour.create(tours)
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
