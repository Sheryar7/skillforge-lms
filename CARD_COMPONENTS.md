# Professional SaaS Card Components

This document describes the professional, production-ready card components created for the Modern LMS platform. All components follow SaaS design best practices and are fully typed with TypeScript.

## Components Overview

### 1. InstructorCourseCard
**Location:** `src/features/courses/components/InstructorCourseCard.tsx`

Professional course management card for instructors. Displays course information with enrollment statistics and management actions.

**Features:**
- Responsive thumbnail with gradient fallback
- Status badge (Published/Draft)
- Price display
- Stats grid (Enrollments, Lessons, Reviews)
- Dual action buttons (Manage Course, Preview Course)
- Hover animations and transitions

**Props:**
```typescript
interface InstructorCourseCardProps {
  course: Course;
  lessonCount?: number;
  enrollmentCount?: number;
}
```

**Example Usage:**
```tsx
<InstructorCourseCard 
  course={courseData}
  lessonCount={15}
  enrollmentCount={234}
/>
```

---

### 2. StudentCourseCard
**Location:** `src/features/courses/components/StudentCourseCard.tsx`

Student-facing course card for the course browsing page. Optimized for discovery and enrollment.

**Features:**
- Interactive thumbnail with zoom on hover
- Price and rating badges
- Category and level tags
- Enrollment count display
- Scale animation on hover
- Quick navigation to course details

**Props:**
```typescript
interface StudentCourseCardProps {
  course: Course;
  enrollmentCount?: number;
  averageRating?: number;
}
```

**Example Usage:**
```tsx
<StudentCourseCard 
  course={courseData}
  enrollmentCount={892}
  averageRating={4.8}
/>
```

---

### 3. CourseDetailCard
**Location:** `src/features/courses/components/CourseDetailCard.tsx`

Full-width course detail card showing comprehensive course information with statistics and custom content areas.

**Features:**
- Large hero thumbnail with title overlay
- Status and price badges integrated in header
- Course description with category
- Four-column stats grid (Lessons, Sections, Enrolled, Duration)
- Customizable content area for actions (children)
- Professional gradient backgrounds

**Props:**
```typescript
interface CourseDetailCardProps {
  course: Course;
  sectionCount?: number;
  lessonCount?: number;
  enrollmentCount?: number;
  children?: React.ReactNode;
}
```

**Example Usage:**
```tsx
<CourseDetailCard 
  course={courseData}
  sectionCount={5}
  lessonCount={32}
  enrollmentCount={128}
>
  <div className="flex gap-3">
    <Button>Enroll Now</Button>
    <Button variant="secondary">Share Course</Button>
  </div>
</CourseDetailCard>
```

---

### 4. StatCard
**Location:** `src/shared/components/StatCard.tsx`

Versatile statistics card component for displaying key metrics throughout the dashboard.

**Features:**
- Flexible icon support (Lucide icons)
- Multiple color variants
- Optional trend indicator (up/down with percentage)
- Customizable subtitle
- Footer content slot for additional info
- Gradient background variants

**Variants:**
- `primary` - Default slate gradient
- `secondary` - Subtle slate
- `success` - Green gradient
- `warning` - Amber/Orange gradient
- `info` - Blue/Cyan gradient

**Props:**
```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: "violet" | "green" | "amber" | "blue" | "red" | "slate";
  variant?: "primary" | "secondary" | "success" | "warning" | "info";
  trend?: {
    direction: "up" | "down";
    value: number;
  };
  children?: ReactNode;
}
```

**Example Usage:**
```tsx
<StatCard
  title="Total Revenue"
  value="$12,450"
  subtitle="Last 30 days"
  icon={DollarSign}
  iconColor="green"
  variant="success"
  trend={{ direction: "up", value: 23 }}
>
  <p className="text-xs text-slate-500">+$2,340 from new courses</p>
</StatCard>
```

---

## Design System

### Colors
- **Primary:** Violet-600 (`#7c3aed`)
- **Text:** Slate-900 (`#0f172a`) - dark, Slate-600 - medium, Slate-500 - light
- **Backgrounds:** Slate-50 (`#f8fafc`) - light backgrounds
- **Borders:** Slate-200 (`#e2e8f0`)

### Spacing
- Border radius: `rounded-[2rem]` (32px), `rounded-2xl` (24px)
- Padding: `p-6` (24px) standard, `p-8` (32px) large
- Gap: `gap-4` (16px), `gap-6` (24px) standard spacing

### Typography
- Titles: `text-lg` to `text-4xl`, `font-black`, `tracking-tight`
- Labels: `text-xs`, `uppercase`, `tracking-[0.3em]`, `font-black`
- Body: `text-sm`, `text-slate-600`, `leading-relaxed`

### Shadows & Effects
- Standard: `shadow-sm` for cards at rest
- Hover: `shadow-md` to `shadow-xl` on interaction
- Transitions: `duration-300` for smooth animations
- Transforms: `scale-105`, `translate-x-1` on hover

---

## Implementation Guidelines

### Best Practices

1. **Always provide fallback content**
   ```tsx
   // If thumbnail is missing, show gradient + icon
   {course.thumbnail ? (
     <Image src={course.thumbnail} ... />
   ) : (
     <div className="... bg-gradient-to-br from-violet-50 to-slate-50">
       <BookOpen className="text-violet-600" />
     </div>
   )}
   ```

2. **Use responsive grids**
   ```tsx
   // Grid changes at breakpoints
   <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
     {courses.map(course => ...)}
   </div>
   ```

3. **Include proper icons**
   ```tsx
   import { BookOpen, Users, BarChart3 } from "lucide-react";
   ```

4. **Type all props**
   ```tsx
   interface ComponentProps {
     course: Course;
     optional?: number;
   }
   ```

---

## Usage Examples

### Instructor Course Listing
```tsx
import InstructorCourseCard from "@/features/courses/components/InstructorCourseCard";

export default function CoursesPage() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map(course => (
        <InstructorCourseCard
          key={course.id}
          course={course}
          lessonCount={stats[course.id]?.lessons || 0}
          enrollmentCount={stats[course.id]?.enrollments || 0}
        />
      ))}
    </div>
  );
}
```

### Dashboard Stats
```tsx
import StatCard from "@/shared/components/StatCard";
import { Users, BookOpen, DollarSign, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Students"
        value="1,234"
        icon={Users}
        iconColor="blue"
        variant="info"
        trend={{ direction: "up", value: 12 }}
      />
      <StatCard
        title="Active Courses"
        value="8"
        icon={BookOpen}
        iconColor="violet"
        variant="primary"
      />
      <StatCard
        title="Revenue"
        value="$8,240"
        icon={DollarSign}
        iconColor="green"
        variant="success"
        trend={{ direction: "up", value: 23 }}
      />
      <StatCard
        title="Growth"
        value="+18%"
        icon={TrendingUp}
        iconColor="amber"
        variant="warning"
      />
    </div>
  );
}
```

### Student Course Browser
```tsx
import StudentCourseCard from "@/features/courses/components/StudentCourseCard";

export default function CourseBrowser() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map(course => (
        <StudentCourseCard
          key={course.id}
          course={course}
          enrollmentCount={enrollmentStats[course.id]}
          averageRating={ratings[course.id]}
        />
      ))}
    </div>
  );
}
```

---

## Accessibility

All cards include:
- Semantic HTML structure
- Proper heading hierarchy
- Color contrast ratios meet WCAG AA standards
- Interactive elements are keyboard accessible
- Icons have proper sizing and spacing

---

## Performance

- Components use React memo for optimization where needed
- Images are optimized via Next.js Image component
- Lazy loading supported for card grids
- CSS classes are optimized with Tailwind's JIT compiler

---

## Browser Support

All components are tested and work on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Future Enhancements

- [ ] Dark mode support
- [ ] Skeleton loading states
- [ ] Drag-and-drop card reordering
- [ ] Card comparison view
- [ ] Advanced filtering in card headers
- [ ] Export/PDF generation
- [ ] Card-level action menus

---

**Last Updated:** May 2026  
**Status:** Production Ready ✓
