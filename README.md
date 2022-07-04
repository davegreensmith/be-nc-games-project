

When cloning this repo, you will need to set up the environment variable on your local work station.

    Create 2 files in the root directory, and add the lines below each:
    1. ".env.development"
        PGDATABASE=nc_games
        PGUSERNAME=<your psql username>
        PGPASSWORD=<your psql password>

    2. ".env.test"
        PGDATABASE=nc_games_test
        PGUSERNAME=<your psql username>
        PGPASSWORD=<your psql password>

ensure these files are included in the .gitignore file (so they are not pushed to github) as

    .env.*

## install npm and relevant packages:

    npm install
    npm install express
    npm install -d supertest
