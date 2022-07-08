# Back-End Northcoders Games project

## Project Summary:

This project is an exercise in the construction of a database (set by `Northcoders`), and building endpoint requests to interact with the database with the following methods:

1. GET
2. PATCH
3. POST
4. DELETE

for all endpoints and details, follow the hosted version link below

## Hosted version link

https://nc-games-dg.herokuapp.com/api/

## Clone the repository from Github:

https://github.com/davegreensmith/be-nc-games-project

## Install npm and relevant packages:

    npm install
    npm install dotenv
    npm install pg
    npm install express
    npm install -d supertest

## Setting the database environment

After cloning this repository, set up the environment variable on your local work station for a `development` database and a `test` database.

Create 2 files in the root directory, and add the lines below each:

`1. ".env.development"`

```js
    PGDATABASE=nc_games
    PGUSERNAME=<your psql username>
    PGPASSWORD=<your psql password>
```

`2. ".env.test"`

```js
    PGDATABASE=nc_games_test
    PGUSERNAME=<your psql username>
    PGPASSWORD=<your psql password>
```

ensure these files are included in the `.gitignore` file (so they are not pushed to github) as

.env.\*

## Running tests

First the database must be created. Seed the database with;

```bash
npm run seed
```

The tests are contained in the `__tests__` folder, which can be ran individually;

```bash
npm test ./__tests__/api.test.js
npm test ./__tests__/categories.test.js
npm test ./__tests__/comments.test.js
npm test ./__tests__/reviews.test.js
npm test ./__tests__/users.test.js
```

These are seperated, to correspond with which database table the tests refer to

---

## Versions

This project uses

### Node.js v18.1.0

### Postgres v14.4
