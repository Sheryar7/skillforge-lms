# Sherry LMS

A modern SaaS Learning Management System built with Next.js, Supabase, TypeScript, and Tailwind CSS. Sherry LMS is designed as a portfolio-ready EdTech platform with role-based dashboards, course management, enrollment workflows, video lessons, and progress tracking.

## Highlights

- Role-based experiences for students and instructors
- Modern SaaS landing page and responsive dark navigation
- Instructor dashboard with course, curriculum, student, and analytics views
- Student dashboard with enrolled courses, progress summaries, and learning activity
- Course builder with sections, lessons, preview lessons, publish state, and video metadata
- Enrollment request flow for protected course access
- Supabase authentication, profile roles, and protected dashboard routing
- Production-ready Next.js App Router structure with TypeScript validation

## Tech Stack

- Framework: Next.js 16 App Router
- Language: TypeScript
- UI: React 19, Tailwind CSS 4, Lucide icons
- Backend: Supabase Auth, Postgres, SSR helpers
- Notifications: Sonner and React Hot Toast
- Tooling: ESLint, TypeScript, Turbopack build

## Core Routes

- `/` - SaaS marketing homepage
- `/courses` - Public course catalog
- `/courses/[courseId]` - Course detail page
- `/learn/[courseId]` - Student course learning view
- `/learn/[courseId]/lesson/[lessonId]` - Lesson player view
- `/dashboard` - Role-aware dashboard redirect
- `/dashboard/student` - Student workspace
- `/dashboard/instructor` - Instructor control center
- `/dashboard/instructor/courses` - Instructor course library
- `/dashboard/instructor/courses/[courseId]` - Course management and curriculum editor
- `/dashboard/instructor/students` - Student roster and enrollment requests
- `/dashboard/settings` - Profile and account settings

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Supabase project with the required tables and auth enabled

### Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_WEBHOOK_SECRET=optional_webhook_secret
```

### Install and Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Quality Checks

```bash
npm run lint
npx tsc --noEmit --pretty false
npm run build
```

Current validation status:

- TypeScript: passes
- Production build: passes
- ESLint: passes with warnings only

## Project Structure

```text
src/
  app/                 App Router pages, layouts, API routes, and proxy
  components/          Legacy/shared compatibility components
  features/            Domain modules for auth, courses, lessons, sections, progress
  lib/                 Supabase clients and utilities
  providers/           Auth provider and shared client context
  shared/              Reusable UI and layout components
  types/               Shared application and database types
docs/
  TRD.md               Technical requirements and design documentation
```

## Portfolio Notes

This project demonstrates:

- Full-stack SaaS product thinking
- Authentication and route protection
- Data-driven dashboards
- Domain-oriented frontend architecture
- Responsive UI design with modern SaaS aesthetics
- Practical integration with Supabase Auth and Postgres

## Future Improvements

- Add a formal Supabase migration directory and seed data
- Replace remaining broad `any` warnings with typed query response models
- Add unit and integration tests for enrollment, auth, and course workflows
- Add file storage integration for production video uploads
- Add instructor revenue analytics and cohort retention charts
- Add student certificates and completion badges
- Add email notifications for enrollment approval and course publication
- Add CI checks for lint, typecheck, and production build

## Documentation

See [docs/TRD.md](docs/TRD.md) for the technical requirements and design document.
