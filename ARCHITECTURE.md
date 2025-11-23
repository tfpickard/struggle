# Architecture

This document describes the high-level architecture of Chaotic Unity.

## System Overview

Chaotic Unity is a server-side rendered (SSR) web application built on SolidStart, with a clear separation between the simulation engine, business logic, and presentation layers.

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Solid Components & Routes                         │ │
│  │  - Reactive UI                                     │ │
│  │  - Client-side simulation rendering                │ │
│  │  - Theme management                                │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────┐
│              SolidStart Server (SSR + API)              │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Server Functions & Routes                         │ │
│  │  - Authentication handlers                         │ │
│  │  - Simulation CRUD                                 │ │
│  │  - Session management                              │ │
│  │  - Authorization checks                            │ │
│  └──────────────────┬─────────────────────────────────┘ │
│                     │                                    │
│  ┌──────────────────▼─────────────────────────────────┐ │
│  │  Business Logic Layer                              │ │
│  │  - Simulation engine (pure TS)                     │ │
│  │  - Auth utilities                                  │ │
│  │  - Validation helpers                              │ │
│  └──────────────────┬─────────────────────────────────┘ │
│                     │                                    │
│  ┌──────────────────▼─────────────────────────────────┐ │
│  │  Data Access Layer (Prisma)                        │ │
│  │  - Type-safe queries                               │ │
│  │  - Connection pooling                              │ │
│  └──────────────────┬─────────────────────────────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              PostgreSQL Database                        │
│  - User, Session, Profile                              │
│  - Simulation, SimulationState                         │
│  - ActivityLog                                         │
└─────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### Presentation Layer

**Location**: `src/routes/`, `src/components/`

**Responsibilities**:
- Render UI based on server data
- Handle user interactions
- Manage client-side state (e.g., theme preference)
- Run simulation engine in browser for live visualization

**Key Patterns**:
- File-based routing via SolidStart
- Server functions for data fetching
- Reactive primitives (signals, effects)
- CSS-in-Tailwind for styling

### Server Function Layer

**Location**: `src/lib/auth/server.ts`, server-marked functions in routes

**Responsibilities**:
- Handle authentication and authorization
- Validate inputs
- Coordinate between business logic and data access
- Set/clear session cookies
- Log activity

**Security**:
- All mutations require CSRF-safe server actions
- Session token validation on every protected request
- Role-based access checks

### Business Logic Layer

**Location**: `src/lib/simulation/`, `src/lib/auth/password.ts`, `src/lib/auth/session.ts`

**Responsibilities**:
- Core simulation engine: stepping, metrics, control
- Password hashing and validation
- Session token generation
- Input validation (email, username, password)

**Design Principles**:
- Pure functions wherever possible
- Zero UI dependencies
- Fully deterministic (seeded randomness)
- Testable in isolation

### Data Access Layer

**Location**: `src/lib/db.ts`, Prisma client

**Responsibilities**:
- Database queries and mutations
- Connection management
- Type-safe data access

**Patterns**:
- Singleton Prisma client (reused across requests)
- Transactional operations where needed
- Efficient indexing for common queries

## Request Lifecycle

### SSR Page Request

1. Browser requests `/playground`
2. SolidStart server renders `src/routes/playground.tsx`
3. Server functions fetch initial data (if needed)
4. HTML is sent to browser with hydration scripts
5. Client hydrates, making page interactive

### Server Action (e.g., Sign In)

1. User submits sign-in form
2. Form data sent to server function `signIn()`
3. Server validates input
4. Server queries database for user
5. Server verifies password hash
6. Server creates session and sets cookie
7. Response sent to client
8. Client revalidates cached data

### Simulation in Browser

1. Page loads with simulation config
2. `SimulationEngine` instantiated client-side
3. `requestAnimationFrame` loop steps simulation
4. Canvas or DOM updated with current state
5. User interactions modify simulation parameters
6. Auto-stabilizer runs on each frame

## Data Flow

### Authentication Flow

```
User Form Input
    │
    ▼
signUp / signIn (server function)
    │
    ├──► validatePassword / validateEmail
    ├──► hashPassword / verifyPassword
    ├──► Prisma: User.create / findFirst
    ├──► createSession (Prisma: Session.create)
    └──► setSessionCookie
         │
         ▼
    Browser receives session cookie
```

### Simulation Save Flow

```
Playground UI
    │
    ▼
Save button clicked
    │
    ▼
saveSimulation (server function)
    │
    ├──► requireAuth()
    ├──► validateInput(name, description)
    ├──► generateSlug(name)
    └──► Prisma: Simulation.create
         │
         ▼
    Simulation record created
         │
         ▼
    Redirect to /simulations/:slug
```

## Module Boundaries

### Simulation Engine

**Exports**: Types, engine class, step functions, metrics

**Imports**: Nothing (pure module)

**Constraints**:
- No DOM access
- No network access
- Deterministic (seeded RNG)

### Auth Module

**Exports**: Server functions, validation utilities

**Imports**: Prisma client, bcrypt, cookie utilities

**Constraints**:
- Server-only (marked with "use server")
- Never exposes password hashes to client

### Database Module

**Exports**: Prisma client singleton

**Imports**: Prisma generated client

**Constraints**:
- Server-only
- Single instance per process (global cache)

## Extension Points

### Adding New Simulation Types

1. Define new config type in `src/lib/simulation/types.ts`
2. Implement state creation and step function
3. Add case to `SimulationEngine.step()`
4. Update UI to support new type

### Adding New Routes

1. Create file in `src/routes/`
2. Export default Solid component
3. Add to navigation if needed

### Adding New Database Models

1. Update `prisma/schema.prisma`
2. Run `npm run migrate`
3. Update seed file if needed

## Performance Considerations

- **SSR**: Initial page load is fast (HTML rendered server-side)
- **Code Splitting**: SolidStart automatically splits routes
- **Prisma Connection**: Singleton client reuses connections
- **Simulation**: Runs entirely client-side (no server load)

## Future Enhancements

### WebSocket Support

Enable real-time collaborative simulations:

1. Add WebSocket endpoint in `app.config.ts`
2. Create room management system
3. Broadcast state updates to all connected clients
4. Handle conflict resolution

### API Endpoints

Expose simulation engine via REST API:

1. Create `/api/simulations` routes
2. Implement API key authentication
3. Add rate limiting
4. Document with OpenAPI spec

### Observability

Add monitoring and logging:

1. Integrate with observability platform (e.g., Axiom, Datadog)
2. Log server function execution times
3. Track simulation performance metrics
4. Monitor database query performance
