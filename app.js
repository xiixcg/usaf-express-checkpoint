const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

const knex = require('knex')(require('./knexfile.js')[ENVIRONMENT]);

app.use(express.json());

app.get('/movies', function (req, res) {
  var title = req.query.title;

  if (typeof title !== 'undefined') {
    knex
      .select('*')
      .from('movies')
      .where('title', title)
      .then(data => {
        if (data.length === 0) {
          throw 'Movie title not found'
        } else {
          return res.status(200).json(data)
        }
      })
      .catch(err => {
        res.status(404).json({
          message:
            err
        })
      })
  } else {
    knex
      .select('*')
      .from('movies')
      .then(data => res.status(200).json(data))
      .catch(err =>
        res.status(404).json({
          message:
            'Page not found'
        })
      );
  }
});

app.get('/movies/:id', function (req, res) {
  var id = req.params.id;

  if (isNaN(parseInt(id))) {
    res.status(400).json({
      message:
        'Invalid ID supplied'
    })
  } else {
    knex
      .select('*')
      .from('movies')
      .where('id', id)
      .then(data => {
        if (data.length === 0) {
          throw 'Movies ID not found'
        } else {
          return res.status(200).json(data)
        }
      })
      .catch(err => {
        res.status(404).json({
          message:
            err
        })
      })
  }
});

app.post('/movies', (req, res) => {
  //curl -X POST -H "Content-Type: application/json" -d '{"title":"John Wich", "runtime":80, "release_year":2015, "director":"not known"}' http://localhost:8080/movies
  const movie = req.body;

  knex
    .insert([{ title: movie.title, runtime: movie.runtime, release_year: movie.release_year, director: movie.director }],
      ['title', 'runtime', 'release_year', 'director'])
    .into('movies')
    .then(data => res.json(data))
})

app.delete('/movies/:id', (req, res) => {
  //curl -X DELETE http://localhost:8080/movies/20
  var id = req.params.id;

  if (isNaN(parseInt(id))) {
    res.status(400).json({
      message:
        'Invalid ID supplied'
    })
  } else {
    knex
      .del(['title', 'runtime', 'release_year', 'director'])
      .from('movies')
      .where('id', id)
      .then(data => {
        if (data.length === 0) {
          throw 'Movies ID not found'
        } else {
          return res.status(200).json(data)
        }
      })
      .catch(err => {
        res.status(404).json({
          message:
            err
        })
      })
  }
})

app.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});

