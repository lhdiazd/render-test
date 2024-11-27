const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.json());
app.use(morgan('tiny'));

// Array de notas de ejemplo (para simular una base de datos)
let notes = [
    { 
      "id": 1,
      "content": "HTML is easy", 
      "important": true
    },
    { 
      "id": 2,
      "content": "CSS is hard", 
      "important": false
    },
    { 
      "id": 3,
      "content": "JavaScript is fun", 
      "important": true
    }
];

// Endpoint para obtener todas las notas
app.get('/api/notes', (request, response) => {
    response.json(notes);
});

// Endpoint para obtener una nota específica por ID
app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);
    if (note) {
        response.json(note);
    } else {
        return response.status(404).json({
            error: 'Nota no encontrada'
        });
    }
});

// Endpoint para crear una nueva nota
app.post('/api/notes', (request, response) => {
    const { content, important } = request.body;

    if (!content) {
        return response.status(400).json({
            error: 'El contenido de la nota es obligatorio'
        });
    }

    const newNote = {
        id: notes.length > 0 ? Math.max(...notes.map(note => note.id)) + 1 : 1, // Generar nuevo ID basado en el máximo ID
        content,
        important: important || false // Si no se especifica, por defecto será false
    };

    notes = notes.concat(newNote);
    response.status(201).json(newNote);
});

// Endpoint para actualizar una nota
app.put('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const { content, important } = request.body;

    const note = notes.find(note => note.id === id);
    if (!note) {
        return response.status(404).json({
            error: 'Nota no encontrada'
        });
    }

    const updatedNote = {
        ...note,
        content: content || note.content, // Actualiza el contenido solo si se proporciona uno nuevo
        important: important !== undefined ? important : note.important // Actualiza 'important' solo si se especifica
    };

    notes = notes.map(note =>
        note.id !== id ? note : updatedNote
    );

    response.json(updatedNote);
});

// Endpoint de información adicional (similar al de las personas en tu código)
app.get('/api/info', (request, response) => {
    const dateNow = new Date();
    const entries = notes.length;
    response.send(`<p>El servidor tiene información de ${entries} notas <br/> <p>${dateNow}`);
});

// Manejo de endpoint desconocidos (404)
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Endpoint desconocido' });
};

app.use(unknownEndpoint);

// Configurar el puerto en el que el servidor escucha
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

