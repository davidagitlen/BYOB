const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', 3000);
app.use(express.json());

app.listen(app.get('port'), () => {
  console.log(`App is listening on port ${app.get('port')}.`);
});

app.get('/', (request, response) => {
  response.send('Here we go!');
});

app.get('/api/v1/planets', (request, response) => {
  database('planets').select()
    .then((planets) => {
      response.status(200).json(planets);
    })
    .catch((err) => {
      response.status(500).json(err);
    })
})