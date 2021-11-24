const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://tetesti:${password}@cluster0.x3pwf.mongodb.net/puhelinluettelo-app?retryWrites=true&w=majority`

mongoose
  .connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')

  Contact
    .find({})
    .then(result => {
      result.forEach(contact => {
        console.log(`${contact.name} ${contact.number}`)
      })
      mongoose.connection.close()
    })
} else {
  const name = process.argv[3]
  const number = process.argv[4]

  const contact = new Contact({
    name: name,
    number: number
  })

  contact
    .save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
}

