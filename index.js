const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const app = express()
const Contact = require('./models/contact')

app.use(express.static('build'))
app.use(express.json())

morgan.token('body', function (req, res) { 
  return JSON.stringify(req.body) 
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

app.get('/api/persons', (request, response, next) => {
  Contact
    .find({})
    .then(contacts => {
      response.json(contacts)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Contact
    .find({})
    .then(contacts => {
      response.send(`<p>Phonebook has info for ${contacts.length} people</p><p>${new Date()}</p>`)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Contact
    .findById(id)
    .then(contact => {
      if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const updatedContact = {
    name: body.name,
    number: body.number,
  }

  Contact
    .findByIdAndUpdate(request.params.id, updatedContact, { new: true })
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Contact
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

/*
const generateId = () => {
  return Math.floor(Math.random() * 1000)
}
*/

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or number cannot be empty'
    })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact
    .save()
    .then(savedContact => {
      response.json(savedContact.toJSON())
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'bad id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})