# Collaborative Task Management Application

A full-stack app with Nest.js backend and Next.js frontend. Features JWT auth, projects and tasks CRUD, real-time updates via Socket.IO, Swagger docs, and Dockerized deployment with Nginx and Postgres.

## Tech Stack
- Backend: Nest.js, TypeORM, PostgreSQL, JWT, Swagger, Socket.IO
- Frontend: Next.js (App Router, TypeScript), Redux Toolkit, Axios, socket.io-client
- Infra: Docker, Docker Compose, Nginx reverse proxy

---

## Quick Start (Docker)
Prerequisites: Docker Desktop

```bash
# from the project root
docker compose up --build
```

- Frontend: http://localhost/
- API: http://localhost/api
- Swagger: http://localhost/api/docs

Environment is pre-wired in `docker-compose.yml`:
- DB is Postgres 16 (service `postgres`)
- Backend reads env from `backend/.env` (created at dev-time; see Local Dev below). For Docker, we override `DB_HOST=postgres`.
- Frontend uses `NEXT_PUBLIC_API_BASE=http://localhost/api` and `NEXT_PUBLIC_WS_BASE=http://localhost`.

To stop: `docker compose down`

---

## Local Development
Prerequisites: Node.js 18+ (tested on 22.x), npm, Postgres 13+ (or Docker Postgres)

### 1) Clone and install
```bash
# from the project root
cd backend && npm i
cd ../frontend && npm i
```

### 2) Environment variables
Create `backend/.env` (for local dev):
```ini
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=tasks_db
JWT_SECRET=supersecretjwt
JWT_EXPIRES_IN=7d
```
If you run Postgres in Docker locally:
```bash
docker run --name tasks-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=tasks_db -p 5432:5432 -d postgres:16-alpine
```

Create `frontend/.env.local` (optional; defaults shown):
```bash
NEXT_PUBLIC_API_BASE=http://localhost:3000/api
NEXT_PUBLIC_WS_BASE=http://localhost:3000
```

### 3) Run backend (Nest.js)
```bash
cd backend
npm run start:dev
```
- API base: http://localhost:3000/api
- Swagger UI: http://localhost:3000/api/docs

### 4) Run frontend (Next.js)
In a new terminal:
```bash
cd frontend
npm run dev
```
- Frontend: http://localhost:3000 (Next default) or as printed in console

Note: If you also run the backend on port 3000, start Next.js on a different port:
```bash
PORT=3001 npm run dev
```
Then set `NEXT_PUBLIC_API_BASE` to `http://localhost:3000/api`.

---

## Project Structure (high-level)
```
backend/
  src/
    auth/           # JWT auth (controller, service, strategy)
    users/          # User entity, profile endpoint
    projects/       # Projects CRUD
    tasks/          # Tasks CRUD + filtering
    realtime/       # Socket.IO gateway (task events)
    main.ts         # Swagger, ValidationPipe, CORS, /api prefix
    app.module.ts   # ConfigModule + TypeORM
  Dockerfile
frontend/
  src/
    app/            # App Router pages (auth, dashboard, projects/[id])
    lib/            # axios api client, socket client
    store/          # Redux store, slices and provider
  Dockerfile
nginx/
  nginx.conf        # Reverse proxy (frontend /, backend /api)
docker-compose.yml
```

---

## API Overview
Base URL (local dev): `http://localhost:3000/api`

- Auth
  - POST `/auth/register` { name, email, password }
  - POST `/auth/login` { email, password }
- Users
  - GET `/users/me` (Bearer token)
- Projects (Bearer token)
  - GET `/projects`
  - POST `/projects` { name, description? }
  - GET `/projects/:id`
  - PATCH `/projects/:id` { name?, description? }
  - DELETE `/projects/:id`
  - POST `/projects/:id/members` { userId }
- Tasks (Bearer token)
  - GET `/projects/:projectId/tasks?status=&assigneeId=`
  - POST `/projects/:projectId/tasks` { title, description?, status?, dueDate? }
  - PATCH `/tasks/:id` { title?, description?, status?, dueDate? | null }
  - POST `/tasks/:id/assign` { assigneeId | null }
  - DELETE `/tasks/:id`

Swagger UI: `GET /api/docs`

### Real-time Events (Socket.IO)
- Namespace: root (same origin)
- Events broadcast to all clients:
  - `task.created` { id, title, status, assignee?, dueDate?, project }
  - `task.updated` { ...task }
  - `task.deleted` { id }

Frontend connects using `NEXT_PUBLIC_WS_BASE` (default `http://localhost:3000`).

---

## Useful Scripts
Backend (from `backend/`):
- `npm run start:dev` — start Nest with watch
- `npm run build` — build to `dist`
- `npm run start:prod` — run built server

Frontend (from `frontend/`):
- `npm run dev` — Next dev server
- `npm run build` — production build
- `npm run start` — start production server

Docker (from project root):
- `docker compose up --build` — build and start all services
- `docker compose down` — stop and remove

---

## Troubleshooting
- Port conflicts:
  - Backend uses 3000; Frontend dev uses 3000 by default; change one (e.g., `PORT=3001 npm run dev`).
- Database connection errors:
  - Verify Postgres is running and credentials in `backend/.env` are correct.
- CORS/Proxy issues:
  - Local dev: backend enables CORS; ensure `NEXT_PUBLIC_API_BASE` is correct.
  - Docker: access the app through Nginx at `http://localhost` so API is `/api`.
- Swagger not loading behind Nginx:
  - Ensure `nginx/nginx.conf` is mounted and `docker compose up --build` was run after changes.

---

## Notes
- This project uses `synchronize: true` for TypeORM in dev for convenience. Do not use in production.
- No seed users: Register via `/auth/register` then authenticate. 