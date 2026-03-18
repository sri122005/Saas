<<<<<<< HEAD
# Multi-Tenant SaaS Application

A complete full-stack SaaS web application using Spring Boot for the backend and React (Vite) for the frontend. The application follows a multi-tenant architecture where multiple organizations (tenants) can register and manage their own users and projects within the same platform while keeping their data isolated.

## Architecture

* **Backend:** Java 17, Spring Boot 3.x, Spring Data JPA, Spring Security, JWT Authentication.
* **Frontend:** React 18, Vite, React Router, Context API, Axios, Vanilla CSS.
* **Database:** PostgreSQL 15.
* **Deployment:** Docker & Docker Compose.

The backend uses Entity-level multitenancy, meaning every user and project row contains a `tenant_id`. Data access is automatically filtered by the logged-in user's `tenant_id`.

## Project Structure

```text
.
├── backend/                  # Spring Boot backend
│   ├── src/main/java/com/saas/multitenant
│   │   ├── controller/       # REST API Endpoints
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── exception/        # Global Exception Handling
│   │   ├── model/            # JPA Entities (Tenant, User, Project)
│   │   ├── repository/       # Spring Data Repositories
│   │   ├── security/         # JWT Filters, Security Config
│   │   └── service/          # Business Logic
│   └── pom.xml               # Maven dependencies
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── assets/           # Static assets
│   │   ├── components/       # Reusable UI components (Navbar, Sidebar)
│   │   ├── context/          # React Context (AuthContext)
│   │   ├── pages/            # Page Views (Login, Dashboard, etc.)
│   │   └── services/         # Axios API service calls
│   └── package.json          # NPM dependencies
└── docker-compose.yml        # Full-stack orchestrator
```

## Setup Instructions

### Option 1: Run with Docker Compose (Recommended)

This is the easiest way to launch the entire stack (Database, Backend API, Frontend).

1. Ensure Docker and Docker Compose are installed.
2. From the root directory, run:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   * **Frontend:** http://localhost:3000
   * **Backend API Docs (Swagger):** http://localhost:8080/swagger-ui.html

### Option 2: Run Locally (Development Mode)

If you want to run the components independently for development:

**1. Start the Database**
Run only the PostgreSQL database using Docker:
```bash
docker-compose up -d db
```

**2. Start the Backend**
Requires JDK 17.
```bash
cd backend
./mvnw spring-boot:run
```
The backend runs on `http://localhost:8080`.

**3. Start the Frontend**
Requires Node.js 18+.
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:3000`.

## API Documentation

The backend exposes an OpenAPI (Swagger) interface. Once the backend is running, visit:
* http://localhost:8080/swagger-ui.html

This provides interactive documentation and testing for all endpoints.

## Multi-Tenant Features & Flow

1. **Register Organization:** Create a new Tenant and its initial Admin User via `/api/auth/register`.
2. **Login:** Authenticate the admin user to receive a JWT.
3. **Workspace Isolation:** Every action the user performs (creating projects, adding users) is securely isolated to their Tenant ID. The `SecurityUtils` extracts the `tenantId` from the JWT ensuring secure scoping across all `/api/projects` and `/api/users` requests.

## Schema Overview

*   `tenants`: `id` (PK), `name`, `created_at`
*   `users`: `id` (PK), `name`, `email`, `password`, `role`, `tenant_id` (FK), `created_at`
*   `projects`: `id` (PK), `name`, `description`, `tenant_id` (FK), `created_at`
=======
# Saas-Application
>>>>>>> 2c28acfe4e4eaad9d69d968b1f1f8afd191c0942
