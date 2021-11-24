const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

require('dotenv').config()

const url = process.env.MONGO_URL

mongoose.connect(url)
  .then(result => {
    console.log('Connected to database')
  })
  .catch(error => {
    console.log('Error connecting to database', error.message)
  })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minlength: 3
  },
  number: {
    type: String,
    minlength: 8
  }
})

contactSchema.plugin(uniqueValidator)

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)