const planetsData = require('../../planets-data');
const planets = planetsData.planets;

const createPlanet = (knex, planet) => {
  return knex('planets').insert({
    name: planet.name,
    day_length: planet.day_length,
    year_length: planet.year_length,
    population: planet.population
  }, 'id');
};

exports.seed = function(knex) {
  return knex('people').del()
    .then(() => knex('planets').del())
    .then(() => {
      let planetPromises = [];

      planets.forEach(planet => {
        planetPromises.push(createPlanet(knex, planet));
      });

      return Promise.all(planetPromises);
    })
    .catch(err => console.log(`Error seeding data: ${err}`));
};
