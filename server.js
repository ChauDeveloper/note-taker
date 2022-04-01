const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();
const {notes} = require('./db/db.json');
const fs = require('fs');
const path = require('path');

function filterByQuery(query, noteArray) {
    let filteredResults = noteArray;
    if (query.title) {
        filteredResults = filteredResults.filter(note => note.title === query.title)
    }
    if (query.text) {
        filteredResults = filteredResults.filter(note => note.text === query.text)
    }
    return filteredResults;
}

function findById(id, noteArray) {
    const result = noteArray.filter(note => note.id === id)[0];
    return result;
  }

app.get('/api/notes', (req, res) => {
    let results = notes;
    if (req.query) {
        results = filterByQuery(req.query, results);
      }
      res.json(results);
})

app.get('/api/notes/:id',(req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
} )

function createNewNote(body, noteArray) {
    const note = body;
    noteArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, '/db/db.json'),
        JSON.stringify({ noteArray}, null, 2)
    )
    return note;
}

function validateNote(note){
    if (!note.title || typeof note.title !== 'string'){
        return false;
    }
    if (!note.text || typeof note.text !== 'string'){
        return false;
    }
    return true;
}

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();
   

    if (!validateNote(req.body)) {
        res.status(400).send('Notes is not formatted');
      } else {
        const note = createNewNote(req.body, notes);
        res.json(note)
      }
   
})

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
  console.log (notes.length.toString())
});