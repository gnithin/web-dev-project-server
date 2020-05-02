# web-dev-project-server

[Endpoint link](https://web-dev-project-server.herokuapp.com/)

[Website Link](https://web-dev-project-client.herokuapp.com)

This repo contains the source-code for the backend of the chowk app. 

Refer to [this link](https://github.com/gnithin/cs5610-final-project) for the front-end code.

[Here is a demo](https://youtu.be/yHT04KPPhxg) of the site.

## Pre-requisites
- [npm](https://www.npmjs.com/get-npm)
- [mysql db](https://www.mysql.com/downloads/)

## Setup
- Install everything
  ```shell script
  $ npm install
  ```
- Lookup the `package.json` file for all the dependencies.
- Add a `.dev.env`(when running in dev environment. `.env` will be required when running a production build) file at the project root.
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

## Deployment
- Auto deployed on merging PRs into `develop` branch.

## API References -
All the APIs are described [here](https://documenter.getpostman.com/view/6351305/SzS8s5P6?version=latest)

## Resources, Heavily used frameworks - 
- Writing Typescript with express -
    - https://typeorm.io/#/example-with-express
    - https://levelup.gitconnected.com/setup-express-with-typescript-in-3-easy-steps-484772062e01
- [TypeORM](https://github.com/typeorm/typeorm)
- [Overnight-js](https://github.com/seanpmaxwell/overnight)
- [Passport-js](https://github.com/jaredhanson/passport)


## Project Team members 
- Keshav Chandrashekar- [keshavchen](https://github.com/keshavchen)
- Nithin Gangadharan - [gnithin](https://github.com/gnithin)
- Tanmay Naik - [tsnaik](https://github.com/tsnaik)
- Viral Patel - [patelviralb](https://github.com/patelviralb)
