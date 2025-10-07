# CyberShield - Smart Cybersecurity Awareness & Threat Detection System

## Overview

CyberShield is a web-based cybersecurity awareness and threat detection platform designed to help individuals and organizations stay safe from online threats. The application provides interactive tools for analyzing security risks including password strength checking, phishing URL detection, suspicious email analysis, and educational modules for learning cybersecurity best practices. Users can track their security posture through comprehensive reports that aggregate their security checks and learning progress.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing
- React Query (TanStack Query) for server state management and API data fetching

**UI Component System**
- Radix UI primitives for accessible, headless component foundation
- Shadcn/ui design system with "new-york" style variant
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for component variant management
- Design inspired by security platforms (Norton, Kaspersky) with clean SaaS aesthetics (Vercel, Linear)

**Styling Architecture**
- Custom CSS variables for theming with dark/light mode support
- Color system optimized for cybersecurity UI (electric blue primary, threat indicators)
- Typography: Inter for body text, JetBrains Mono for code/technical elements
- Consistent spacing scale using Tailwind units (4, 6, 8, 12, 16, 20)

**State Management Pattern**
- Server state managed via React Query with infinite stale time
- Local UI state in component-level useState/useContext
- Theme state persisted to localStorage via ThemeProvider context

### Backend Architecture

**Server Framework**
- Express.js running on Node.js with ESM modules
- TypeScript for type safety across frontend and backend
- Middleware stack: JSON parsing, URL encoding, request logging with timing
- Custom error handling middleware for consistent API responses

**API Design**
- RESTful endpoints under `/api` prefix
- Password checker: POST `/api/password-check`, GET `/api/password-checks`
- URL detector: POST `/api/url-check`, GET `/api/url-checks`
- Email analyzer: POST `/api/email-check`, GET `/api/email-checks`
- Learning system: GET `/api/learning-modules`, GET `/api/learning-module/:id`, POST `/api/learning-progress`
- Security reporting: GET `/api/security-report`

**Security Analysis Engine**
- Server-side analysis algorithms for password strength, URL risk, and email threats
- Password hashing for privacy (stores hash, not actual password)
- Scoring systems: 0-100 for passwords, risk levels (safe/suspicious/dangerous) for URLs
- Threat detection arrays for identified risks

**Storage Strategy**
- In-memory storage (MemStorage class) for development with Map-based data structures
- Schema defined in `shared/schema.ts` for type safety across client/server
- Drizzle ORM configured for PostgreSQL migration path (schema ready, database TBD)
- Data models: PasswordCheck, UrlCheck, EmailCheck, LearningModule, UserProgress, SecurityReport

### Data Models & Schema

**Database Schema Design (Drizzle + PostgreSQL)**
- `password_checks`: id, passwordHash, strength, score, suggestions[], createdAt
- `url_checks`: id, url, isSafe, riskLevel, threats[], createdAt
- `email_checks`: id, emailContent, riskScore, riskLevel, detectedThreats[], createdAt
- `learning_modules`: id, title, description, content, difficulty, icon, estimatedTime
- `user_progress`: id, moduleId, completed, quizScore, createdAt
- All use UUID primary keys with `gen_random_uuid()` defaults
- Timestamps track when security checks occurred

**Zod Validation**
- `createInsertSchema` generates runtime validators from Drizzle schemas
- Insert schemas omit auto-generated fields (id, createdAt)
- Type inference ensures TypeScript types match runtime validation

### Development & Build Pipeline

**Development Mode**
- Vite dev server with middleware mode integrated into Express
- HMR enabled with Vite's WebSocket connection
- Source maps via `@jridgewell/trace-mapping`
- Replit-specific plugins: runtime error overlay, cartographer, dev banner

**Production Build**
- Frontend: Vite builds optimized React bundle to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js` (ESM format)
- Static file serving from built frontend in production
- Database migrations via `drizzle-kit push` command

**TypeScript Configuration**
- Strict mode enabled for maximum type safety
- Path aliases: `@/*` (client), `@shared/*` (shared types), `@assets/*` (attached assets)
- Incremental builds with build info caching
- Module resolution: bundler mode for Vite compatibility

## External Dependencies

### Third-Party Libraries

**UI Component Libraries**
- Radix UI (@radix-ui/*): Headless accessible components (dialogs, popovers, dropdowns, etc.)
- Embla Carousel: Touch-enabled carousel/slider functionality
- Lucide React: Icon system for UI elements
- React Hook Form + Zod Resolvers: Form validation and management

**State & Data Fetching**
- TanStack React Query v5: Async state management, caching, invalidation
- Wouter: Minimal routing library (~1.2KB)

**Styling & Design System**
- Tailwind CSS: Utility-first CSS framework
- Class Variance Authority: Type-safe component variants
- CMDK: Command palette component

**Utilities**
- date-fns: Date manipulation and formatting
- clsx + tailwind-merge: Class name merging utilities
- nanoid: Unique ID generation

### Backend Services

**Database**
- Neon Serverless (@neondatabase/serverless): PostgreSQL adapter for serverless environments
- Drizzle ORM: Type-safe SQL query builder and schema manager
- Drizzle Kit: Migration tool and schema synchronization
- Connect-pg-simple: PostgreSQL session store (configured but unused in current memory storage)

**Runtime Environment**
- Node.js with native ESM module support
- Environment variables: DATABASE_URL (required for production PostgreSQL connection)

### Development Tools

**Replit Integration**
- @replit/vite-plugin-runtime-error-modal: Development error overlay
- @replit/vite-plugin-cartographer: Code navigation helper
- @replit/vite-plugin-dev-banner: Development mode indicator

**Build Tools**
- Vite: Frontend build tool and dev server
- esbuild: Fast backend bundler for production
- tsx: TypeScript execution for development server
- PostCSS + Autoprefixer: CSS processing pipeline

### Design Resources

**Typography**
- Google Fonts: Inter (primary UI font), JetBrains Mono (code/technical elements)

**Design Inspiration**
- Security platforms: Norton, Kaspersky (trust and professionalism)
- Modern SaaS: Vercel, Linear (clean UI patterns)
- Material Design principles for consistency