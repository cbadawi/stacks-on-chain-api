<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

_Work-in-progress_ to opensource [stacks on chain](https://stacksonchain.com/). A Nestjs app that reads from a stacks blockchain indexed in a postgres database.

## Installation

```bash
$ yarn
$ yarn prisma migrate resolve --applied "20220914034633_initial_migration"
$ yarn prisma generate && yarn prisma migrate deploy
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Documentation

After running the app, visit http://localhost:8080/v1/api-docs.
