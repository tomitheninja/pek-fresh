<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/6wj0hh6.jpg" alt="Project logo"></a>
</p>

<h3 align="center">PÉK: Profiles & Groups</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kir-dev/pek-fresh.svg)](https://github.com/kir-dev/pek-fresh/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kir-dev/pek-fresh.svg)](https://github.com/kir-dev/pek-fresh/pulls)
[![License](https://img.shields.io/badge/license-UNKNOWN-red.svg)](/LICENSE)

</div>

---

<center>
This repository houses the latest version of our in-house developed administration system, known as pek.

You can find the previous version called next [here](https://github.com/kir-dev/pek-next).
</center>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Tests](#tests)
- [Usage](#usage)
- [Built Using](#built_using)
- [Authors](#authors)

## 🧐 About <a name = "about"></a>

Write about 1-2 paragraphs describing the purpose of your project.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

- Node
- Postgres
- python3 (development only)
- java (development only)

or

- Docker
- Docker Compose (optional)

### Installing with docker

```bash
docker build -t pek-fresh .
```

### Installing with docker-compose

```bash
docker-compose build
```

### Installing with entrypoint.py

```bash
python3 entrypoint.py build metal --install --no-validate
```

### Installing manually (not recommended)

```bash
cd backend
npm ci
npm run build

# you can find the whole command in entrypoint.py
npx @openapitools/openapi-generator-cli generate ...

cd ../frontend
npm ci
npm run build
```

## 🚀 Deployment <a name = "deployment"></a>

### Using docker-compose (recommended)

1. copy `.env.example` to `.env`
2. verify that `POSTGRES_HOST` is correct at both places

```bash
docker-compose up -d
```

### Using docker

1. copy `.env.example` to `.env`
2. verify that `POSTGRES_HOST` is correct at both places

#### start a postgres server

```bash
docker run -d -p 5432:5432 --env-file=./.env postgres
```

#### start the webserver

```bash
docker run -d -p 4000:4000 --env-file=./.env pek-fresh
```

### In development mode

1. copy `.env.example` to `.env`
2. verify that `POSTGRES_HOST` is `localhost` at both places

#### Start the server

This will install the dependencies using `npm` and start a development server.

```bash
docker run -d -p 5432:5432 --env-file=./.env --name pek-fresh-db postgres
python3 ./entrypoint.py shell --cwd backend 'npm run migrate:dev -- --skip-generate'
python3 ./entrypoint.py dev --init
```

For more information run `python3 ./entrypoint.py dev --help`

## 🔧 Running the tests <a name = "tests"></a>

Explain how to run the automated tests for this system.

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## 🎈 Usage <a name="usage"></a>

Add notes about how to use the system.


## ⛏️ Built Using <a name = "built_using"></a>

- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

- [Tamás Südi](https://github.com/tomitheninja) - starter template

<!-- See also the list of [contributors](https://github.com/kylelobo/The-Documentation-Compendium/contributors) who participated in this project. -->
