"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  GraduationCap,
  BarChart3,
} from "lucide-react";

interface SidebarProps {
  userRole: string;
}

type MenuItem = {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
};

const studentMenu: MenuItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    href: "/dashboard/student",
    icon: LayoutDashboard,
  },
  {
    id: "courses",
    name: "My Courses",
    href: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    id: "certificates",
    name: "Certificates",
    href: "/dashboard/certificates",
    icon: GraduationCap,
  },
  {
    id: "settings",
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const instructorMenu: MenuItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    href: "/dashboard/instructor",
    icon: LayoutDashboard,
  },
  {
    id: "courses",
    name: "Courses",
    href: "/dashboard/instructor/courses",
    icon: BookOpen,
  },
  {
    id: "students",
    name: "Students",
    href: "/dashboard/instructor/students",
    icon: GraduationCap,
  },
  {
    id: "users",
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    id: "analytics",
    name: "Analytics",
    href: "/dashboard/instructor/analytics",
    icon: BarChart3,
  },
  {
    id: "settings",
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const normalizedRole = userRole?.toLowerCase() || "student";

  const menuItems =
    normalizedRole === "instructor"
      ? instructorMenu
      : studentMenu;

  const isActive = (item: MenuItem) => {
    if (item.id === "dashboard") {
      return pathname === item.href;
    }

    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <aside className="w-full h-screen flex flex-col justify-between bg-white border-r border-gray-200">
      {/* TOP */}
      <div className="px-4 py-6">
        {/* LOGO */}
        <div className="mb-10 px-3">
          <h1 className="text-2xl font-extrabold text-violet-700">
            Sherry LMS
          </h1>

          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">
            {normalizedRole === "instructor"
              ? "Instructor Panel"
              : "Student Workspace"}
          </p>
        </div>

        {/* MENU */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const active = isActive(item);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  group
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-2xl
                  transition-all
                  duration-200
                  font-semibold
                  ${
                    active
                      ? "bg-violet-100 text-violet-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }
                `}
              >
                <item.icon
                  size={20}
                  className={`shrink-0 ${
                    active
                      ? "text-violet-700"
                      : "text-gray-500 group-hover:text-black"
                  }`}
                />

                {/* FIXED TEXT VISIBILITY */}
                <span
                  className={`text-sm leading-none ${
                    active
                      ? "text-violet-700"
                      : "text-gray-700 group-hover:text-black"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="p-5 border-t border-gray-200">
        <div className="text-center text-xs text-gray-500 font-medium">
          © 2026 Sherry LMS
        </div>
      </div>
    </aside>
  );
}
