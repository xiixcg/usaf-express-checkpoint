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
          throw 'error'

        } else {

          return res.status(200).json(data)
        }
      })
      .catch(err => {
        res.status(404).json({
          message:
            'Movie title not found'
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
          throw 'error'

        } else {

          return res.status(200).json(data)
        }
      })
      .catch(err => {
        res.status(404).json({
          message:
            'Movies ID not found'
        })
      })
  }
});

app.post('/movies', (req, res) => {

  knex
    .insert([{ title: 'Great Gatsby', runtime: '451', release_year: 1991, director: 'james' }],
      ['title', 'runtime', 'release_year', 'director'])
    .into('movies')
    .then(data => res.json(data))
})

app.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});

