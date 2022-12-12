House of Games API

For connecting to the databases for development and testing of this repo two .env files must be created;

- .env.development

- .env.test

The contents of each will be used to connect to the relevant database, i.e.

- .env.development should contain only `PGDATABASE=nc_games`

- .env.test should contain only `PGDATABASE=nc_games_test`
