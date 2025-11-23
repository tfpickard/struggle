# Chaotic Unity

A useless device as a service: explore chaotic dynamics and imperfect control systems in an interactive playground.

## Overview

Chaotic Unity is a production-ready web application that simulates deterministic chaotic systems with an imperfect auto-stabilizer. Built with modern web technologies, it demonstrates n-body gravitational dynamics and coupled oscillator networks, all wrapped in a polished, responsive interface.

## Features

- **Chaotic Dynamics**: N-body gravitational systems and coupled oscillator networks
- **Auto-Stabilizer**: Imperfect control algorithm that attempts (and sometimes fails) to bring order to chaos
- **Multi-User**: Full authentication system with role-based access control
- **Responsive Design**: Optimized for desktop, mobile, and iOS/iPadOS
- **Dark Mode**: System-aware theme with manual override
- **Share & Explore**: Save and share interesting configurations

## Tech Stack

- **Frontend**: SolidJS 1.9.10, SolidStart 1.2.0, TypeScript 5.9.3
- **Styling**: Tailwind CSS with custom theme system
- **Database**: PostgreSQL with Prisma ORM 7.0.0
- **Authentication**: Secure session-based auth with bcrypt
- **Runtime**: Node.js 22.x
- **Deployment**: Vercel with serverless functions

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- npm or compatible package manager
- PostgreSQL database

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd struggle
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file with:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   ```

4. Run database migrations:
   ```bash
   npm run migrate
   ```

5. Seed the database (optional):
   ```bash
   npm run db:seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run migrate` - Run Prisma migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed the database

## Deployment

### Vercel

This project is configured for deployment on Vercel with Node.js 22 runtime.

1. Install Vercel CLI (optional):
   ```bash
   npm i -g vercel
   ```

2. Set up PostgreSQL database:
   - Use Vercel Marketplace to provision a Neon Postgres database
   - Copy the `DATABASE_URL` to your environment variables

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables in Vercel dashboard:
   - `DATABASE_URL` - Your PostgreSQL connection string

5. Run migrations on production database:
   ```bash
   npm run migrate:deploy
   ```

## Project Structure

```
.
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── lib/
│   │   ├── auth/        # Authentication logic
│   │   ├── simulation/  # Core simulation engine
│   │   └── db.ts        # Prisma client
│   ├── routes/          # SolidStart file-based routing
│   ├── app.css          # Global styles and theme variables
│   ├── app.tsx          # Root component
│   ├── entry-client.tsx # Client entry point
│   └── entry-server.tsx # Server entry point
├── app.config.ts        # SolidStart configuration
├── tailwind.config.ts   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## Simulation Engine

The simulation engine is a pure TypeScript module with zero UI dependencies, making it highly testable and reusable.

### N-Body Dynamics

Simulates gravitational interactions using:
- Velocity Verlet integrator for numerical stability
- Configurable gravitational constant and softening parameter
- Energy and angular momentum tracking

### Coupled Oscillators

Network of spring-connected oscillators with:
- Nearest-neighbor coupling
- Configurable spring constant and coupling strength
- Damping for energy dissipation

### Auto-Stabilizer

An intentionally imperfect control system that:
- Identifies the most unstable component
- Applies small corrective forces
- Includes randomness for unpredictable behavior
- Can operate in stabilize or antagonize mode

See [SIMULATION.md](./SIMULATION.md) for detailed technical documentation.

## Architecture

The application follows a clean separation of concerns:

- **Presentation Layer**: Solid components and routes
- **Business Logic**: Pure TypeScript modules (simulation engine, auth utilities)
- **Data Access**: Prisma ORM with type-safe queries
- **API Layer**: SolidStart server functions

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architectural documentation.

## Security

Security features include:

- Password hashing with bcrypt (12 rounds)
- Secure session cookies (HttpOnly, Secure, SameSite=Lax)
- Role-based access control
- Input validation on client and server
- CSRF protection via SolidStart server actions

See [SECURITY.md](./SECURITY.md) for security documentation.

## Contributing

This is a personal project, but feel free to fork and experiment.

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Author

Tom Pickard (tom@pickard.dev)
