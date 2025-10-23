# URL Transformer

Transforms the public dataset exposed by `https://rest-test-eight.vercel.app/api/test` into a structured, cache-friendly map of hosts, folders, and files. Built with NestJS 10, the service demonstrates modular architecture, resilient HTTP integrations, and request-scoped observability.

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [API](#api)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Testing & Quality](#testing--quality)
- [Tooling](#tooling)
- [Docker](#docker)
- [Project Structure](#project-structure)

## Overview
When the client calls `GET /url-manipulation`, the service:
1. Fetches a flat list of file URLs from the Vercel test endpoint via `HttpModule`.
2. Normalises and groups the URLs into a nested structure keyed by host and directory depth.
3. Caches the transformed payload to avoid reprocessing large responses.
4. Returns the result with request metadata and consistent logging for traceability.

`data.json` in the repository mirrors the upstream dataset and can be used for local experimentation.

## Key Features
- Deterministic URL tree transformation that survives deeply nested and non-ASCII paths.
- In-memory caching (backed by Nest `CacheModule`) with TTL sourced from configuration.
- Request-scoped Winston logger with trace IDs managed by a global interceptor.
- Centralised, typed response envelope and exception filter for predictable errors.
- Optional Swagger UI (`/docs`) that is toggled via environment variables.
- Production-ready Dockerfile that performs multi-stage builds and runs under PM2.

## Architecture
- **`AppModule`** wires feature modules and loads configuration namespaces (`database`, `logger`, `services`, `general`).
- **`modules/url-manipulation`** exposes the primary endpoint. The controller adds caching and logging interceptors, while the service holds the transformation logic.
- **`modules/services`** contains reusable REST clients. `VercelTestService` extends `AbstractRestService` to inherit consistent logging, error handling, and Axios configuration.
- **`common/modules/logger`** provides a request-scoped Winston wrapper with configurable transports (console, rotating files).
- **`common/modules/response`** shapes success and error DTOs, ensuring responses include metadata such as trace IDs and timestamps.
- **`common/interceptors/logger.interceptor.ts`** injects a trace ID, logs requests/responses, and appends metadata (trace, duration) to every payload.
- **`common/filters/http-excetpion.filter.ts`** normalises thrown errors into the shared response format.
- **`modules/hello-world`** offers a lightweight liveness check at `GET /hello-world`.

## API
### `GET /hello-world`
Returns a plain `"Hello, World!"` response to verify the service is healthy.

### `GET /url-manipulation`
Returns the transformed view of the Vercel dataset. Example (truncated) response:

```json
{
  "34.8.32.234": [
    {
      "$360Section": [
        "360.7B12DBA104F7493B51086D5C3F01DDDA.q3q"
      ]
    },
    "$RECYCLE.BIN",
    {
      "S-1-5-18": ["desktop.ini"]
    },
    {
      "360Rec": [
        { "20210201": ["1618316.vir"] },
        { "20210206": ["15071C4.vir"] }
      ]
    }
  ],
  "metadata": {
    "trace": "e1f0b5c7...",
    "duration": "87ms"
  }
}
```

The `metadata` block is injected by the global logging interceptor and can be used to correlate logs.

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Provide configuration** (see [Configuration](#configuration)). At a minimum set `VERCEL_TEST_SERVICE_ENDPOINT`.
3. **Run the service**
   ```bash
   npm run start:dev
   ```
4. **Verify**
   - `curl http://localhost:3000/hello-world`
   - `curl http://localhost:3000/url-manipulation`

For production builds, use `npm run build` followed by `npm run start:prod`.

## Configuration
All configuration is environment-driven and loaded via `@nestjs/config`. Key variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `APP_PORT` | `3000` | Port exposed by NestJS. |
| `APP_NAME` | `nest-app` | Name used in Swagger metadata. |
| `APP_PREFIX` | _(empty)_ | Adds a global route prefix when set (e.g. `api/v1`). |
| `APP_DOC_ENABLED` | `false` | Enable Swagger UI at `/${PREFIX}/docs` when `true`. |
| `IP_WHITE_LIST` | `*` | CORS origin whitelist. |
| `VERCEL_TEST_SERVICE_ENDPOINT` | _(required)_ | Base URL for the upstream dataset (`https://rest-test-eight.vercel.app/`). |
| `NODE_CACHE_TTL` | `100` | Cache lifetime (seconds) for `@nestjs/cache-manager`. |
| `LOGGER_TRANSPORTS` | `console` | Comma-separated logger transports (`console`, `daily_rotate`). |
| `LOGGER_CONSOLE_LEVEL` | `info` | Console log level. |
| `LOGGER_DAILY_ROTATE_FILE` | `logs/application-%DATE%.log` | Rotation target when `daily_rotate` is active. |
| `LOGGER_LINE_LENGTH` | `50000` | Maximum JSON length logged per line. |
| `MYSQL_DB_*` | _(optional)_ | Placeholder MySQL settings, ready for future persistence needs. |
| `REDIS_*` | _(optional)_ | Redis connection details used by the reusable `CacheService` module. |

> Tip: create a `.env` file and run with `APP_DOC_ENABLED=true` to expose Swagger locally.

## Testing & Quality
- `npm run test` – run unit tests (Jest).
- `npm run test:e2e` – execute the Supertest-backed end-to-end suite.
- `npm run test:cov` – gather coverage.
- `npm run lint` – lint the codebase with ESLint/TypeScript ESLint.
- `npm run format` – apply Prettier formatting to `src/` and `test/`.

Mocks for the logger and response services live under `__mocks__/` to keep tests deterministic.

## Tooling
- **Runtime**: Node.js 20, NestJS 10, Axios HTTP client, Node Cache via `@nestjs/cache-manager`.
- **Observability**: Winston with configurable transports, structured metadata injected by interceptors.
- **Validation**: Global `ValidationPipe` enforcing DTO whitelisting and friendly 422 errors.
- **Documentation**: `@nestjs/swagger` with optional basic-auth secured UI.
- **Formatting & Linting**: Prettier, ESLint (TypeScript rules).
- **Testing**: Jest, `@nestjs/testing`, Supertest for e2e flows.

## Docker
Multi-stage `Dockerfile` (Node 20 Alpine) that:
1. Installs dependencies in an isolated builder image.
2. Compiles the TypeScript project.
3. Produces a lean production image that runs the compiled bundle via PM2.

Build and run:
```bash
docker build -t url-transformer .
docker run -p 3000:3000 --env-file .env url-transformer
```

## Project Structure
```
src/
  main.ts                 # Application bootstrap, CORS, Swagger, global pipes
  app.module.ts           # Root module wiring
  modules/
    hello-world/          # Health-check endpoint
    services/             # HTTP clients (VercelTestService, abstract REST helpers)
    url-manipulation/     # Core controller + transformation service + DTOs
  common/
    constants/            # Shared enums and error codes
    filters/              # HTTP exception filter
    interceptors/         # Logger interceptor with trace IDs
    middleware/           # Cookie middleware for Swagger auth flows
    modules/              # Logger, response, cache, redis infrastructure
    utils/                # Reusable helpers (env, object clone, cache keys)
test/                     # Jest e2e suite
Dockerfile                # Multi-stage production build with PM2
data.json                 # Sample payload mirroring upstream service
```

This project is a solid foundation for demonstrating NestJS expertise: modular design, typed contracts, observability, and production-minded tooling, all centred around an easily explainable transformation use case.
