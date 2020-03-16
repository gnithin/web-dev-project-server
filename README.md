# web-dev-project-server

## Pre-requisites
- [npm](https://www.npmjs.com/get-npm)
- [mysql db](https://www.mysql.com/downloads/)

## Setup
- Install everything
  ```shell script
  $ npm install
  ```
- Lookup the `package.json` file for all the dependencies.
- Add a `.env` or `.dev.env` file at the project root.
- It will have the following entries, depending on what is to be connected - 
  ```
  DB_TYPE=mysql
  DB_HOST=localhost
  DB_PORT=3306
  DB_USERNAME=<YOUR_DB_USERNAME>
  DB_PASSWORD=<YOUR_DB_PASSWORD>
  DB_SCHEMA=<YOUR_DB_NAME>
  ```

## Running dev environment
- Run - 
  ```shell script
  $ npm run dev
  ```
- This should start a local server.
- Every change will be instantly reflected, without a restart.

## Prod build
- Run - 
  ```shell script
  $ npm run start-prod
  ```
- This should create a build directory, with the transpiled js files.

## Resources - 
- Writing Typescript with express -
    - https://typeorm.io/#/example-with-express
    - https://levelup.gitconnected.com/setup-express-with-typescript-in-3-easy-steps-484772062e01
    - Not using any kind of builder since it seems to be too complex. Can probably decide on it later.
