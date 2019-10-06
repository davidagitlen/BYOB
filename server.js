//require in express as a variable from npm installation (configure for babel if you desire to use import syntax)
const express = require('express');

//assign express function to variable for easy to read syntax when accessing middleware functionality, which provides request and response objects
const app = express();

//set default environment of development, unless one such as production or test is directly provided
const environment = process.env.NODE_ENV || 'development';

//require in path to knexfile configuration, accessing specified environment object through bracket notation (since environment variable will be string)
const configuration = require('./knexfile')[environment];

//connect to database with knex using the environment's settings 
const database = require('knex')(configuration);

//tell express to default to port 3000 if another one is not specified 
app.set('port', process.env.PORT || 3000);

//configure express to parse json data with middleware function
app.use(express.json());


//bind http server object and display message in terminal when express makes successful request to port and is monitoring connection for requests
app.listen(app.get('port'), () => {
  console.log(`App is listening on port ${app.get('port')}.`);
});

//route http GET requests to specified path (root) with route handler function, sending back string of text
app.get('/', (request, response) => {
  response.send('Welcome to BYOB/SWAPI-tables! Please visit an appropriate path to see information displayed in the browser, or make a fetch call to a documented endpoint of your choosing.');
});

//route http GET requests to specified path (following api and versioning convention) indicating collection of planets following RESTful API conventions
app.get('/api/v1/planets', (request, response) => {
  //queries postgreSQL database to find table labeled planets and return an array containing all columns/rows as a Promise
  database('planets').select()
  //returns status code of 200 (for GET - resource fetched and transmitted in message body) and parses response with json method
    .then(planets => {
      response.status(200).json(planets);
    })
  //returns status code of 500 (generic internal server error status) and parses error message with json method
    .catch(err => {
      response.status(500).json(err);
    })
});

//route http GET requests to specified path (api/versioning convention) indicating collection of people following RESTful API conventions
app.get('/api/v1/people', (request, response) => {
  //queries postgreSQL database to find table labeled people and return an array containing all columns/rows as a Promise
  database('people').select()
  //returns status code of 200 (for GET - resource fetched and transmitted in message body) and parses response with json method
    .then(people => {
      response.status(200).json(people);
    })
  //returns status code of 500 (generic internal server error status) and parses error message with json method
    .catch(err => {
      response.status(500).json(err);
    })
});

//route http GET requests to specified dynamic path (api/versioning convention & parameter indicated by :id) indicating a specific planet from the collection of planets identified with an id provided by the user 
app.get('/api/v1/planets/:id', (request, response) => {
  //queries postgreSQL database at table labeled planets to find the specific row where the column labeled 'id' matches the id provided in the dynamic path, which has been transmitted in the request object as a key of id generated in the params object, and return an array containing it as a Promise
  database('planets').where('id', request.params.id).select()
    //write condition that initial response 'planet' is an array with a truthy length (an integer greater than zero, in this case), and if so send back a status code of 200 (GET successful, fetched resource transmitted in message body) and parse that information with json method 
    .then(planet => {
      if (planet.length) {
        response.status(200).json(planet);
        //otherwise send back a status of 404(resource not found) and send back an object with a key of error indicating that there is no resource with the id specified in the dynamic url, parsed by json method
      } else {
        response.status(404).json({
          error: `Could not find planet with id ${request.params.id}`
        })
      }
    })  
    //handle general server error with catch that returns status 500 (general internal server error) and parses error message with json method
    .catch(err => {
      response.status(500).json(err);
    })
});

//route http GET requests to specified dynamic path (api/versioning convention/parameter indicated by :id) indicating a specific person from the collection of people as identified with an id provided by the user 
app.get('/api/v1/people/:id', (request, response) => {
  //queries postgreSQL database at table labeled people to find the specific row where the column labeled 'id' matches the id provided in the dynamic path, which has been transmitted in the request object as a key of id generated in the params object, and return an array containing it as a Promise
  database('people').where('id', request.params.id).select()
  //write condition that initial response 'person' is an array with a truthy length (an integer greater than zero, in this case), and if so send back a status code of 200 (GET successful, fetched resource transmitted in message body) and parse that information with json method 
    .then(person => {
      if(person.length) {
        response.status(200).json(person)
        //otherwise send back a status of 404 (resource not found) and send back an   object with a key of error indicating that there is no resource with the id   specified in the dynamic url, parsed by json method
      } else {
        response.status(404).json({
          error: `Could not find person with id ${request.params.id}`
        })
      }
    })
    //handle general server error with catch that returns status 500 (general internal server error) and parses error message with json method
    .catch(err => {
      response.status(500).json(err)
    })
});

//route http POST requests to specified path (following api and versioning convention) indicating collection of planets following RESTful API conventions
app.post('/api/v1/planets', (request, response) => {
  //assign body of transmitted request to variable of planet
  const planet = request.body;

  //write for loop assigning variable of requiredParameter to array of necessary keys in request body/planet object and iterating over it. If request body/planet object does not contain that key return response of 422 (unprocessable entity) indicating that the content of the request was understood, and the syntax is correct, but the contained instructions cannot be processed, and dynamically indicate which key the request body lacks
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

  //if the initial condition is satisfied, query the postgreSQL table labeled planets and insert the request body/planet object into the table, returning the id value generated by the table as an array in a Promise
  database('planets').insert(planet, 'id')
    //send back a status code of 201 (created -  request successful and a new resource has been created) along with an object containing the id returned by the table and parsed with json method
    .then(planet => {
      response.status(201).json({ id: planet[0]})
    })
    //handle general server error with catch that returns status 500 (general internal server error) and parses error message with json method
    .catch(err => {
      response.status(500).json(err);
    })
});

//route http POST requests to specified path (following api and versioning convention) indicating collection of planets following RESTful API conventions
app.post('/api/v1/people', async (request, response) => {
  //assign body of transmitted request to variable person
  const person = request.body;
  //query postgreSQL database at table labeled planets, returning row where value in column 'name' matches the homeworld provided by the request body/person object, and returning it as an object/Promise assigned to variable planet with async/await
  const planet = await database('planets').where('name', person.homeworld).first();
  //construct second object containing original person information and assign correct id from planets table as key of foreign key name in people table
  const personToInsert = {...person, planet_id: planet.id };

   //write for loop assigning variable of requiredParameter to array of necessary keys in request body/person object and iterating over it. If request body/person object does not contain that key return response of 422 (unprocessable entity) indicating that the content of the request was understood, and the syntax is correct, but the contained instructions cannot be processed, and dynamically indicate which key the request body lacks
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

   //if the initial condition is satisfied, query the postgreSQL table labeled people and insert the request body/person object into the table, returning the id value generated by the table as an array in a Promise
  database('people').insert(personToInsert, 'id')
    .then(person => {
      response.status(201).json({ id: person[0] })
    })
    //handle general server error with catch that returns status 500 (general internal server error) and parses error message with json method
    .catch(err => {
      response.status(500).json(err)
    })
});

//route http DELETE requests to specified dynamic path (api/versioning convention/parameter indicated by :id) indicating a specific person from the collection of people as identified with an id provided by the user 
app.delete('/api/v1/people/:id', (request, response) => {
  //query postgreSQL database at table labeled people, deleting row where value in column 'id' matches the id provided in the dynamic path, which has been transmitted in the request object as a key of id generated in the params object, and returning it as a Promise (with no information)
  database('people').where('id', request.params.id).del()

    //write intital condition- if response object is truthy (exists) transmit response of 200 (request has succeeded): I am choosing 200 here over the perhaps more popular choice of 204 so that I can send a message confirming that the specific person with the provided id has been deleted in the response body, as 204 does not permit any information to be transmitted
    .then(res => {
      if (res) {
      response.status(200).send(`Individual with id ${request.params.id} has been deleted from the database.`)
      // If response object is falsey return response with status code 404 (resource not found) and message informing user of that fact 
      } else {
      response.status(404).send('No individual with that id was found.') 
      }
    })
    //handle general server error with catch that returns status 500 (general internal server error) and parses error message with json method
    .catch(err => {
      response.status(500).json(err);
    });
})