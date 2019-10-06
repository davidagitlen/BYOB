# BYOB - Build Your Own Backend

This project creates a simple back end server with Express and Knex, allowing a user (front end developer) to access information stored in a PostgreSQL database with two tables in a one-to-many relationship.

The data consists of information on planets and people from the Star Wars universe, pulled from the Star Wars API (SWAPI). Each planet has many native inhabitants, and each person has one homeworld. 

The sprint board was created in GitHub Projects, and can be found above or at this (link)[https://github.com/davidagitlen/BYOB/projects/1].

## Project Setup

The project is deployed to heroku, with a root url of https://dg-byob.herokuapp.com/. Paths for specific information, and any necessary information to pass along with the requests, are detailed below.

## API - Endpoints

Calls to the API can be made through a method of making valid HTTP requests, such as the Fetch API, or a platform such as Postman. The BYOB API currently supports a total of seven calls: four GET requests, two POST requests, and a DELETE request. Besides the required method, the options object for the POST requests should contain the header `'Content-Type': 'application/json'`, and an object of the required information in the body.

### Planet Information

The database starts off containing information on 61 planets from the Star Wars universe. The user may choose to retrieve the entire set of data to familiarize themselves with it, or to retrieve a single planet's data in isolation (replacing the `:id` in the url with a valid planet's id). New planets can be added to the database with POST requests.

| Purpose | URL | Verb | Request Body | Sample Success Response |
|----|----|----|----|----|
| Retrieve all planets' information |`/api/v1/planets`| GET | none required | `[{id: 1, name: "Chandrila", day_length: "20", year_length: "368", population: "1200000000",created_at: "2019-10-04T15:37:26.913Z", updated_at: "2019-10-04T15:37:26.913Z" }, { id: 2, name: "Sullust", day_length: ... }, ...]` |
| Retrieve a single planet's information |`/api/v1/planets/:id`| GET | none required | For the path `/api/v1/planets/1` : `[{ id: 1, name: "Chandrila", day_length: "20", year_length: "368", population: "1200000000", created_at: "2019-10-04T15:37:26.913Z", updated_at: "2019-10-04T15:37:26.913Z" }]` |
| Add a planet to the database |`/api/v1/planets/`| POST | `{ name: <String>, day_length: <String>, year_length: <String>, population: <String> }` | `{ id: <new id of planet created> }` |

GET requests for a single planet made to a path with an id outside the range of valid ids will return the message `{ error: "Could not find planet with id 200" }`. 

Post requests for a planet lacking required parameters in the request body will return an error message asking for the missing information. 

### People Information 

The database starts off containing information on 87 individual people from the Star Wars universe. The user may choose to retrieve the entire set of data to familiarize themselves with it, or to retrieve a single person's data in isolation (replacing the `:id` in the url with a valid person's id). New individuals can be added to the database with POST requests, and individuals can be removed with a DELETE request (again, replacing the `:id` in the url with a valid person's id).

| Purpose | URL | Verb | Request Body | Sample Success Response |
|----|----|----|----|----|
| Retrieve all people's information |`/api/v1/people`| GET | none required | `[{id: 1, name: "Jocasta Nu", height: "167", mass: "unknown", birth_year: "unknown", homeworld: "Coruscant", planet_id: 28, created_at: "2019-10-04T15:37:27.243Z", updated_at: "2019-10-04T15:37:27.243Z" }, { id: 2, name: "Shaak Ti", height: "178", mass: ...}, ...]` |
| Retrieve a single person's information |`/api/v1/people/:id`| GET | none required | For the path `/api/v1/planets/1` : `[{ id: 1, name: "Jocasta Nu", height: "167", mass: "unknown", birth_year: "unknown", homeworld: "Coruscant", planet_id: 28, created_at: "2019-10-04T15:37:27.243Z", updated_at: "2019-10-04T15:37:27.243Z"}]` |
| Add a person to the database |`/api/v1/people/`| POST | `{ name: <String>, height: <String>, mass: <String>, birth_year: <String>, homeworld: <String> }` | `{ id: <new id of person created> }` |
| Remove a person from the database |`/api/v1/people/:id`| DELETE | none required | `Individual with id <id passed into path> has been deleted from the database.` |

GET requests for a single person made to a path with an id outside the range of valid ids will return the message `{ error: "Could not find person with id 200" }`.

POST requests for a person lacking required parameters in the request body will return an error message asking for the missing information. It is suggested that the end user be restricted to set choices for the person's homeworld that match the names of planets in the planets database (such as with a select dropdown or a text input with associated datalist), to allow for consistency in corresponding ids.

DELETE requests made for an id not found in the database will return the message `No individual with that id was found`.
