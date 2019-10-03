// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/swapi_tables',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true,
  }
  
};
