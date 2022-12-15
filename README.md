# House of Games API

In it's current form this repo contains the backend of review database.

It holds details of users, their reviews of games (split into categories) and comments on those reviews.

## Hosted Version

- Link: https://nc-games.onrender.com/

Make a GET request to /api for details of available endpoints.

## Testing/development

For connecting to the databases for development and testing of this repo two .env files must be created;

- .env.development

- .env.test

The contents of each will be used to connect to the relevant database, i.e.

- .env.development should contain only `PGDATABASE=nc_games`

- .env.test should contain only `PGDATABASE=nc_games_test`

### Dependencies
