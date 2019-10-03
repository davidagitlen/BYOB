
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('planets', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('day_length');
      table.string('year_length');
      table.string('population');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('people', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('height');
      table.string('mass');
      table.string('birth_year');
      table.string('homeworld');
      table.integer('planet_id').unsigned();
      table.foreign('planet_id')
        .references('planets.id');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('people'),
    knex.schema.dropTable('planets')
  ]);
};
