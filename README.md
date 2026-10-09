# Vehicle Tracking and Fleet Monitoring System

A capstone fleet monitoring platform combining a React web dashboard with a Spring Boot REST API backed by MySQL.

## Project Structure

```
├── backend/                 # Spring Boot REST API (Java 21)
│   ├── pom.xml              # Maven build
│   └── src/main/
│       ├── java/com/fleet/
│       │   ├── config/      # Security config, JWT filter, seed data, exception handler
│       │   ├── controller/  # REST endpoints
│       │   ├── dto/         # Request/response records (snake_case JSON)
│       │   ├── entity/      # JPA entities
│       │   ├── repository/  # Spring Data repositories
│       │   ├── security/    # JWT service, auth entry point
│       │   └── service/     # Business logic
│       └── resources/application.properties
├── frontend/                # React + Vite web dashboard
├── db/                      # Legacy data files (unused by current stack)
├── docs/                    # ER diagram and problem statement
└── README.md
```

## Components

### 1. Web Frontend (React + Vite)
- Located in `frontend/`
- Login page and dashboard (vehicles, drivers, trips, live locations, maintenance, fuel)
- Proxies `/api` to the Spring Boot API on `http://localhost:8080`

```bash
cd frontend
npm install
npm run dev
```

### 2. Spring Boot REST API
- Located in `backend/` (Spring Boot 3.5.4, Java 21, Spring Security + JWT, Spring Data JPA)
- Endpoints under `/api`: health, auth, dashboard, vehicles, drivers, trips, locations, maintenance, fuel
- Stores data in MySQL (schema auto-created via `ddl-auto=update`)
- Demo login: `admin@fleet.com` / `admin123`

## Prerequisites

- Java 21+
- Maven 3.9+
- MySQL running locally on port 3306

## Database Setup

1. Create the config file from the template:

```bash
cd backend/src/main/resources
copy application.properties.example application.properties
```

2. Edit `application.properties` with your MySQL credentials and JWT secret:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/fleet_monitoring?createDatabaseIfNotExist=true&serverTimezone=UTC&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
app.jwt.secret=CHANGE_ME_TO_A_LONG_RANDOM_STRING
```

> `application.properties` is gitignored so credentials stay out of the repository. Commit only the `.example` template.

3. Start the API:

```bash
cd backend
mvn spring-boot:run
```

The server runs on `http://localhost:8080`. On first startup it seeds an admin user, three drivers, three vehicles, and sample trip/location/maintenance/fuel records.

## API Overview

| Method | Endpoint | Auth |
| ------ | -------- | ---- |
| GET | `/api/health` | public |
| POST | `/api/auth/login` | public |
| GET | `/api/dashboard/summary` | any role |
| GET/POST | `/api/vehicles` | read any, write admin |
| PUT/DELETE | `/api/vehicles/{id}` | admin |
| GET/POST | `/api/drivers` | read any, write admin |
| PUT/DELETE | `/api/drivers/{id}` | admin |
| GET/POST | `/api/trips` | any role |
| PUT | `/api/trips/{id}/end` | any role |
| GET/POST | `/api/locations` | any role |
| GET/POST | `/api/maintenance` | read any, write admin |
| GET/POST | `/api/fuel` | read any, write admin |

Login returns `{ "token": "...", "user": { ... } }`; send it as `Authorization: Bearer <token>`. Responses use snake_case JSON for frontend compatibility. Errors return `{ "error": "message" }`.

## Notes

- MySQL `user` is a reserved word; the `User` entity maps to a backtick-quoted `` `user` `` table.
- `db/` (legacy `fleet-data.json` / `fleet.db`) is kept for reference but no longer used by the stack.
- Never commit real database passwords or the JWT secret.
