module.exports = {
  development: {
    client: "pg",
    connection: {
      database: "cluckr",
      password: 112358
    },
    migrations: {
      tableName: "migrations",
      directory: "./db/migrations",
    },
  },
};
  