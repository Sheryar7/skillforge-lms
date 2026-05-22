# Technical Requirements Document: Sherry LMS

## 1. Overview

Sherry LMS is a SaaS-style Learning Management System for instructors and students. The platform supports course discovery, enrollment requests, role-based dashboards, curriculum management, video lesson metadata, and student progress views.

The product is intended for portfolio presentation and can be deployed as a full-stack Next.js application backed by Supabase.

## 2. Goals

- Provide a polished EdTech SaaS experience for public visitors, students, and instructors.
- Allow instructors to create, manage, publish, and monitor courses.
- Allow students to browse courses, request enrollment, access lessons, and track progress.
- Use Supabase for authentication, role profiles, database access, and protected user flows.
- Keep the codebase modular enough for continued growth.

## 3. Non-Goals

- Native mobile applications
- Full payment processing
- Enterprise tenant management
- Advanced video transcoding pipeline
- Production-grade analytics warehouse

## 4. User Roles

### Visitor

- Views landing page and public course catalog.
- Can sign up or log in.
- Can preview available public course information.

### Student

- Views student dashboard.
- Browses courses and requests enrollment.
- Accesses approved course content.
- Tracks progress and learning activity.

### Instructor

- Views instructor dashboard and metrics.
- Creates and manages courses.
- Builds curriculum with sections and lessons.
- Reviews enrollment requests.
- Monitors student roster and analytics.

## 5. Functional Requirements

### Authentication

- Users can sign up, log in, and log out.
- Auth state is synchronized through Supabase.
- Dashboard routes require an authenticated session.
- User role is resolved from profile data.

### Course Catalog

- Courses are listed publicly.
- Course detail pages show course metadata.
- Published state controls availability and presentation.

### Instructor Course Management

- Instructors can view a course management panel.
- Course panel shows thumbnail, title, status, sections, lessons, and enrollment metrics.
- Instructors can publish or return a course to draft.
- Curriculum management supports sections and lessons.
- Lessons support title, description, video URL, duration, preview status, and published status.

### Enrollment

- Students can request access to instructor courses.
- Instructors can approve or reject enrollment requests.
- Approved requests create student enrollment records.
- Student roster displays active enrollments.

### Learning Experience

- Students can open course learning pages.
- Lessons are grouped by section.
- Preview lessons are accessible before approval.
- Locked lessons require enrollment approval.

### Dashboards

- Instructor dashboard shows course, student, enrollment, and revenue-style metrics.
- Student dashboard shows active courses, progress, certificates, and recent learning activity.
- Sidebar navigation reflects the active route correctly.

## 6. Non-Functional Requirements

- Responsive layout across mobile, tablet, and desktop.
- High contrast, accessible UI states.
- Production build must pass.
- TypeScript validation must pass.
- Environment secrets must stay out of Git.
- Public README must be portfolio-ready and not expose private credentials.

## 7. Architecture

### Frontend

- Next.js App Router handles routes, layouts, dynamic segments, and API routes.
- React client components power dashboards, auth-driven UI, and interactive course management.
- Tailwind CSS provides the design system and responsive styling.
- Shared UI components live under `src/shared`.

### Backend

- Supabase Auth manages sessions.
- Supabase Postgres stores profiles, courses, sections, lessons, enrollments, progress, and requests.
- API routes handle server-side integrations such as auth webhook sync and video upload entrypoints.
- Proxy middleware protects dashboard routes.

### Data Access

- Browser-side Supabase client is used for interactive authenticated workflows.
- Server-side Supabase client is used for server-rendered instructor course pages.
- Services under `src/features/*/services` centralize domain queries.

## 8. Suggested Data Model

### profiles

- `id`
- `email`
- `full_name`
- `role`
- `avatar_url`

### courses

- `id`
- `title`
- `description`
- `price`
- `thumbnail`
- `category`
- `level`
- `status`
- `published`
- `instructor_id`
- `created_at`
- `updated_at`

### sections

- `id`
- `course_id`
- `title`
- `created_at`
- `updated_at`

### lessons

- `id`
- `section_id`
- `title`
- `description`
- `video_url`
- `duration`
- `position`
- `is_preview`
- `published`
- `created_at`
- `updated_at`

### enrollment_requests

- `id`
- `student_id`
- `course_id`
- `instructor_id`
- `status`
- `created_at`

### enrollments

- `id`
- `user_id`
- `course_id`
- `created_at`

### lesson_progress

- `id`
- `user_id`
- `lesson_id`
- `course_id`
- `completed`
- `updated_at`

## 9. Security Requirements

- Use Supabase Auth for authenticated sessions.
- Use role checks before instructor-only dashboard pages.
- Use Row Level Security policies in Supabase for production.
- Store only public Supabase keys in `NEXT_PUBLIC_*` variables.
- Keep webhook secrets server-only.
- Never commit `.env.local`.

## 10. Deployment Requirements

- Install dependencies with `npm install`.
- Configure environment variables on the hosting platform.
- Run `npm run build` before deployment.
- Recommended deployment target: Vercel.
- Recommended database provider: Supabase hosted Postgres.

## 11. Quality Status

Validated commands:

```bash
npm run lint
npx tsc --noEmit --pretty false
npm run build
```

Current state:

- Production build passes.
- TypeScript passes.
- ESLint exits successfully with warnings.

## 12. Known Technical Debt

- Some legacy compatibility components still use broad `any` types.
- Several older components remain in `src/components` while newer modules live under `src/features` and `src/shared`.
- Supabase schema should be formalized as migrations.
- Automated tests are not yet included.

## 13. Future Improvements

- Add Supabase migrations and local seed scripts.
- Add Playwright end-to-end tests for login, enrollment, and course publishing.
- Add unit tests for services and hooks.
- Add object storage for video uploads and signed playback URLs.
- Add instructor payout, revenue, and cohort analytics.
- Add certificate generation and public verification pages.
- Add email notifications for course approvals and enrollment status changes.
- Add role management for admins.
- Add CI workflow for lint, typecheck, and build.
- Add screenshots and demo GIFs for portfolio presentation.
