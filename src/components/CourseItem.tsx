"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  course: {
    id: number;
    title: string;
  };
};

export default function CourseItem({ course }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(course.title);
  const router = useRouter();

  // DELETE
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/courses/${course.id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/courses/${course.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // CRITICAL: This was missing
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        setEditing(false);
        router.refresh();
      } else {
        const errorData = await response.json();
        alert("Update failed: " + errorData.error);
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="p-4 bg-white border rounded flex justify-between items-center text-black">
      {editing ? (
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-1 rounded"
          autoFocus
        />
      ) : (
        <span>{course.title}</span>
      )}

      <div className="flex gap-2">
        {editing ? (
          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
          >
            Edit
          </button>
        )}

        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}