const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.use(express.json());

app.listen(app.get('port'), () => {
  console.log(`App is listening on port ${app.get('port')}.`);
});

app.get('/', (request, response) => {
  response.send('Welcome to BYOB/SWAPI-tables! Please visit an appropriate path to see information displayed in the browser, or make a fetch call to a documented endpoint of your choosing.');
});

app.get('/api/v1/planets', (request, response) => {
  database('planets').select()
    .then(planets => {
      response.status(200).json(planets);
    })
    .catch(err => {
      response.status(500).json(err);
    })
});

app.get('/api/v1/people', (request, response) => {
  database('people').select()
    .then(people => {
      response.status(200).json(people);
    })
    .catch(err => {
      response.status(500).json(err);
    })
});

app.get('/api/v1/planets/:id', (request, response) => {
  database('planets').where('id', request.params.id).select()
    .then(planet => {
      if (planet.length) {
        response.status(200).json(planet);
      } else {
        response.status(404).json({
          error: `Could not find planet with id ${request.params.id}`
        })
      }
    })  
    .catch(err => {
      response.status(500).json(err);
    })
});

app.get('/api/v1/people/:id', (request, response) => {
  database('people').where('id', request.params.id).select()
    .then(person => {
      if(person.length) {
        response.status(200).json(person)
      } else {
        response.status(404).json({
          error: `Could not find person with id ${request.params.id}`
        })
      }
    })
    .catch(err => {
      response.status(500).json(err)
    })
});

app.post('/api/v1/planets', (request, response) => {
  const planet = request.body;

  for (let requiredParameter of ['name', 'day_length', 'year_length', 'population']) {
    if (!planet[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: {
          name: <String>,
          day_length: <String>,
          year_length: <String>,
          population: <String>
        }. You're missing a "${requiredParameter}" property.`})
    }
  }

  database('planets').insert(planet, 'id')
    .then(planet => {
      response.status(201).json({ id: planet[0]})
    })
    .catch(err => {
      response.status(500).json(err);
    })
});

app.post('/api/v1/people', async (request, response) => {
  const person = request.body;
  const planet = await database('planets').where('name', person.homeworld).first();
  const personToInsert = {...person, planet_id: planet.id };

  for (let requiredParameter of ['name', 'height', 'mass', 'birth_year', 'homeworld']) {
    if (!person[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: {
          name: <String>,
          height: <String>,
          mass: <String>,
          birth_year: <String>,
          homeworld: <String>
        }. You're missing a "${requiredParameter} property."`})
    }
  }

  database('people').insert(personToInsert, 'id')
    .then(person => {
      response.status(201).json({ id: person[0] })
    })
    .catch(err => {
      response.status(500).json(err)
    })
});

app.delete('/api/v1/people/:id', (request, response) => {
  database('people').where('id', request.params.id).del()
    .then(res => {
      if (res) {
      response.status(200).send(`Individual with id ${request.params.id} has been deleted from the database.`)
      } else {
      response.status(404).send('No individual with that id was found.') 
      }
    })
    .catch(err => {
      response.status(500).json(err);
    });
})