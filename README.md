# House of Games API

In it's current form this repo contains the backend of review database.

It holds details of users, their reviews of games (split into categories) and comments on those reviews.

## Hosted Version

- Link: https://nc-games.onrender.com/

Make a GET request to /api for details of available endpoints.

## Testing/development

### Cloning

- create a new local folder

- fork on github and clone into your local folder

> git clone your_forked_repo.git

### Dependencies

> npm install

to install all dependencies.

#### Minimum versions

- Node.js v2.2.0

- Node Postgres v8.7.3

### Connecting to databases

For connecting to the databases for development and testing of this repo two .env files must be created;

- .env.development

- .env.test

The contents of each will be used to connect to the relevant database, i.e.

- .env.development should contain only `PGDATABASE=nc_games`

- .env.test should contain only `PGDATABASE=nc_games_test`

### Seeding

Test database should be seeded prior to running each test;

> const testData = require("../db/data/test-data/index.js");
>
> beforeEach( ( ) => seed(testData) );

Dev database can be seeded;

> npm run seed

### Testing

Jest, Supertest

> npm test
