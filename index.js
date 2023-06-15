const express  = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

const unknownEndpoint = (request, response) => {
    response.status(404).send({error : 'unknown endpoint '})
}



let notes = [
    {    id: 1,    content: "HTML is easy",    important: true  },
    {    id: 2,    content: "Browser can execute only JavaScript",    important: false  },
    {    id: 3,    content: "GET and POST are the most important methods of HTTP protocol",    important: true
    }]

app.get('/', (request, response) => {
    response.send('<h1><strong>Hellloooo EXPRESS!!</strong></h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)

    console.log(id)
    const note = notes.find(note => {
        console.log(note.id, typeof note.id, typeof id, note.id === id)
        return note.id === id
    })

    if(note) {
        response.json(note)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()

})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId + 1
}
app.post('/api/notes', (request, response) => {
    const body = request.body

    if(!body.content) {
        response.status(400).json({
            error: 'content missing..'
        })
    }

    const note = {
        content: body.content,
        id: generateId(),
        important: body.important || false
    }

        notes = notes.concat(note)
        response.json(note)
})

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`)
})



