# Shopping List

A full stack shopping list app built with React + TypeScript, Express + TypeScript, and MongoDB.

## Requirements

- Node.js 20.19+ (or 22.12+)
- MongoDB (local or Atlas)

## Setup

### Backend

1. `cd backend`
2. `cp .env.example .env` and set your MongoDB connection string
3. `npm install`
4. `npm run dev`

### Frontend

1. `cd frontend`
2. `npm install`
3. Optional: `cp .env.example .env` to override the API base URL
4. `npm run dev`

## Docker Compose

1. `docker compose up --build`
2. Open `http://localhost:8080`
3. API is available at `http://localhost:3001`

To stop and remove volumes:

`docker compose down -v`

## E2E

1. `docker compose up -d --build`
2. `npm run e2e`

## UI Library

No external UI libraries were used.

## Tooling

From the repository root:

1. `npm install`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test`
5. `npm run build`
6. `npm run e2e`

## Testing

### Backend

1. `cd backend`
2. `npm test`

### Frontend

1. `cd frontend`
2. `npm test`

## API Endpoints

- `GET /items`
- `POST /items`
- `PUT /items/:id`
- `DELETE /items/:id`
