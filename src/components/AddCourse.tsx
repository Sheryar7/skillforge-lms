"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCourse() {
    const [title, setTitle] = useState("");
    const router = useRouter();

    const handleAdd = async () => {
        await fetch("/api/courses", {
            method: "POST", // The method must match the exported function name
            headers: {
                "Content-Type": "application/json", // Critical for the server to parse the body
            },
            body: JSON.stringify({ title: title }),
        });

        // Clear input and refresh
        setTitle("");
        router.refresh();
    };

    return (
        <div className="mb-6 flex gap-2">
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New course"
                className="border p-2 w-full"
            />

            <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-4"
            >
                Add
            </button>
        </div>
    );
}