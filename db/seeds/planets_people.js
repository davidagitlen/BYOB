const planetsData = require('../../planets-data');
const peopleData = require('../../people-data');

const planets = planetsData.planets;
const people = peopleData.people;

const createPlanet = (knex, planet) => {
  return knex('planets').insert({
    name: planet.name,
    day_length: planet.day_length,
    year_length: planet.year_length,
    population: planet.population
  }, 'id');
};

const createPerson = (knex, person) => {
  return knex('planets').where('name', person.homeworld).first()
    .then(planet => {
      return knex('people').insert({
        name: person.name,
        height: person.height,
        mass: person.mass,
        birth_year: person.birth_year,
        homeworld: person.homeworld,
        planet_id: planet.id
      })
    })
}

exports.seed = function (knex) {
  return knex('people').del()
    .then(() => knex('planets').del())
    .then(() => {
      let planetPromises = [];
      planets.forEach(planet => {
        planetPromises.push(createPlanet(knex, planet));
      });
      return Promise.all(planetPromises);
    })
    .then(() => {
      let peoplePromises = [];
      people.forEach(person => {
        peoplePromises.push(createPerson(knex, person));
      });
      return Promise.all(peoplePromises);
    })
    .catch(err => console.log(`Error seeding data: ${err}`));
};