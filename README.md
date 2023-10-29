# events7-dashboard

This project is a simple dashboard for events managment

Project consists of frontend and backend

- events7-frontend (simple vuejs application for interacting and managing events)
- events7-backend (nestjs application for handling event crud operation and persist data)

Note: We used an in-memory database for simplicity, in the real world, we would use MySQL, PostgreSQL, or a more appropriate database.

Please note that this project is designed for evaluation purposes as part of expertise test for Outfit7

## Project Setup

### Docker

The simplest way to run the application is with docker.

Run command "docker-compose up -d" in the project root directory

```sh
docker-compose up -d
```

The application is running at http://localhost:8080.
The API is accessible at http://localhost:3000.

### Manual setup

#### Backend

```sh
cd events7-backend
```

```sh
npm install
```

```sh
npm start
```

API is running on http://localhost:3000

#### Frontend

```sh
cd events7-frontend
```

```sh
npm install
```

```sh
npm run dev
```

Application is running on http://localhost:8080

#### Testing

```sh
cd events7-backend
```

```sh
npm install
```

```sh
npm test
```
