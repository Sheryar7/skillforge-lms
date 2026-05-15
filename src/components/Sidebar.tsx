"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export default function Sidebar({ userRole }: SidebarProps) {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    const menuItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            roles: ["student", "instructor"]
        },
        {
            name: "Courses",
            href: "/dashboard/courses",
            icon: BookOpen,
            roles: ["student", "instructor"]
        },
        {
            name: "Students",
            href: "/dashboard/students",
            icon: GraduationCap,
            roles: ["instructor"]
        },
        {
            name: "Users",
            href: "/dashboard/users",
            icon: Users,
            roles: ["instructor"]
        },
        {
            name: "Analytics",
            href: "/dashboard/analytics",
            icon: BarChart3,
            roles: ["instructor"]
        },
        {
            name: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
            roles: ["student", "instructor"]
        },
    ];

    // Filter based on user role (case-insensitive)
    const filteredMenu = menuItems.filter((item) =>
        item.roles.some(role => role.toLowerCase() === (userRole?.toLowerCase() || "student"))
    );

    return (
        <aside className="hidden md:flex w-72 h-full bg-white border-r border-gray-200 flex-col justify-between shrink-0">
            <div>
                <div className="px-5 py-8">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6 px-3 font-bold">
                        {userRole?.toLowerCase() === "instructor" ? "Instructor Panel" : "Student Menu"}
                    </p>

                    <nav className="space-y-2">
                        {filteredMenu.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
                                        active
                                            ? "bg-violet-50 text-violet-700 shadow-sm"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <item.icon size={20} className={active ? "text-violet-700" : "text-gray-500"} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            <div className="p-5 border-t border-gray-50">
                <div className="text-center text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                    © 2026 Sherry LMS
                </div>
            </div>
        </aside>
    );
}