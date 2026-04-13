# R+ TELECOM

Professional full-stack platform for telecom subscription management, admin operations, and customer workflows.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [Development Workflow](#development-workflow)
- [API Proxy and Routing](#api-proxy-and-routing)
- [Troubleshooting](#troubleshooting)
- [Production Notes](#production-notes)

## Overview

R+ TELECOM is composed of two applications:

- `frontend`: Next.js web app (admin dashboard + client flows)
- `backend`: Express API server handling business logic and integrations

The platform supports secure admin authentication, subscription lifecycle management, reporting, and integrations with external services.

## Architecture

```text
Frontend (Next.js, :3000)
   -> /api/* (same-origin calls)
   -> Next.js rewrite/proxy
Backend (Express, :5000)
   -> Database + external providers
```

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Axios
- **Backend:** Node.js, Express, Prisma, PostgreSQL, JWT auth
- **Services:** Supabase, Resend, Gemini API

## Prerequisites

- Node.js `18+`
- npm `9+`

## Quick Start

### 1) Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2) Configure environment variables

Create `backend/.env` (template below).  
Frontend variables are optional unless you need custom hosts.

### 3) Run both apps

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Application URL: [http://localhost:3000](http://localhost:3000)

## Environment Configuration

### Backend (`backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Data
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_database_url

# Admin auth
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret

# Email
RESEND_API_KEY=your_resend_key
EMAIL_FROM=onboarding@resend.dev

# AI
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend (optional)

```env
# Base URL used by frontend API helper
NEXT_PUBLIC_API_BASE_URL=/api

# Backend target used by Next.js rewrites
BACKEND_URL=http://localhost:5000
```

## Development Workflow

- Start backend first to avoid proxy/runtime errors.
- Start frontend second and open `/admin` or user pages.
- For admin endpoints, authenticate to receive a valid token.

## API Proxy and Routing

The frontend uses same-origin API calls by default:

- Frontend requests: `/api/...`
- Next.js rewrite: `/api/:path*` -> `${BACKEND_URL}/api/:path*`

This removes hardcoded localhost URLs in components and makes environment switching cleaner.

## Troubleshooting

- **`ERR_CONNECTION_REFUSED`**
  - Backend is not running or not on the expected port.
  - Verify `backend` terminal shows server listening on `:5000`.

- **`500` on frontend `/api/...`**
  - Usually means proxy reached backend, but backend threw an error.
  - Check backend terminal logs for root cause.

- **`401` / `403` on admin APIs**
  - Session/token is missing or expired.
  - Re-login and retry.

- **CORS/Auth issues after URL changes**
  - Confirm `FRONTEND_URL`, `BACKEND_URL`, and `NEXT_PUBLIC_API_BASE_URL` are aligned.

## Production Notes

- Use secure secrets management for all keys and credentials.
- Set `NODE_ENV=production` and production URLs for frontend/backend.
- Add monitoring, structured logging, and backup strategy for operational stability.

