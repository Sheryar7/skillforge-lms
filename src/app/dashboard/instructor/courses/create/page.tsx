"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { useCourse } from "@/features/courses/hooks/useCourse";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export default function CreateCoursePage() {
  const router = useRouter();
  const { createCourse, loading } = useCourse();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("0");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Please provide a course title before continuing.");
      return;
    }

    try {
      const newCourse = await createCourse(
        {
          title: title.trim(),
          description: description.trim() || null,
          price: Number(price) || 0,
          category: category.trim() || null,
          level: level.trim() || null,
          status: "draft",
          published: false,
        },
        thumbnailFile
      );

      router.push(`/dashboard/instructor/courses/${newCourse.id}`);
      toast.success("Course created successfully. Welcome to the editor.");
    } catch (error: any) {
      toast.error(error.message || "Unable to create course at this time.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-violet-700">
            <Plus size={14} /> New course studio
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create a new course track</h1>
            <p className="max-w-2xl text-sm text-slate-500">Set the foundation for your curriculum and launch once the course structure is ready.</p>
          </div>
        </div>

        <Link href="/dashboard/instructor/courses" className="text-sm font-black uppercase tracking-[0.28em] text-slate-500 hover:text-slate-900">
          Back to courses
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-2">
          <Input
            label="Course title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Practical SaaS Product Management"
          />
          <div className="space-y-1.5 w-full">
            <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1 block">Price</label>
            <input
              type="number"
              value={price}
              min="0"
              step="1"
              onChange={(event) => setPrice(event.target.value)}
              className="w-full p-4 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-medium text-sm outline-none focus:border-violet-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1 block">Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            placeholder="Write a short summary that explains what students will learn..."
            className="w-full p-4 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-medium text-sm outline-none focus:border-violet-500 transition-all resize-none"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Input
            label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="e.g. Design, Marketing, Development"
          />
          <Input
            label="Level"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            placeholder="e.g. Beginner, Intermediate, Advanced"
          />
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-black">Course thumbnail</p>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setThumbnailFile(event.target.files?.[0] ?? null)}
            className="w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-black file:text-violet-700"
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.32em] text-slate-500">Course metadata</p>
            <p className="text-sm text-slate-500 mt-2">After creation, you can add sections and lessons inside the instructor editor.</p>
          </div>
          <Button type="submit" variant="primary" isLoading={loading} className="px-8 py-4 rounded-2xl">
            Create course
          </Button>
        </div>
      </form>
    </div>
  );
}
