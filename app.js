const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('common'));
const apps = require('./playstore.js');

app.get('/apps', (req, res) => {
  const { search = "", sort, genre } = req.query;

  if (sort) {
    if (!['rating', 'app'].includes(sort)) {
      return res
        .status(400)
        .send('Sort must be one of rating or app');
    }
    if (genre) {
      if (!['Action', 'Puzzla', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genre)) {
        return res
          .status(400)
          .send('Genre must be Action, Puzzla, Strategy, Casual, Arcade, Card');
      }
  }

  let results = apps
    .filter(app =>
      app
        .App
        .toLowerCase()
        .includes(search.toLowerCase()));

  if (sort == 'rating') {
    let score = 'Rating';
    results.sort((a, b) => {
      return a[score] > b[score] ? -1 : a[score] < b[score] ? 1 : 0;
    })
    } if (sort == 'app') {
      let name = 'App';
      results.sort((a, b) => {
        return a[name].toLowerCase() > b[name].toLowerCase() ? 1 : a[name].toLowerCase() < b[name].toLowerCase() ? -1 : 0;
      })
  } 

  if (genre) {
    let resultsFinal = results.filter(app => 
      app.Genres.toLowerCase().includes(genre.toLowerCase()))
  } else {
    resultsFinal = results
  }

  res.json(resultsFinal);
  };
});

app.listen(8000, () => {
  console.log('Server started on PORT 8000');
});