"use client";

import { useEffect, useState } from "react";
import { Video, FileText, Tag, Layers, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import UploadThumbnail from "./UploadThumbnail";
import { useCourse } from "../hooks/useCourse";
import { Course, CreateCourseInput, UpdateCourseInput } from "../types/course.types";
import { COURSE_CATEGORIES, COURSE_LEVELS, COURSE_STATUSES } from "../constants/course.constants";

interface CourseFormProps {
  mode: "create" | "edit";
  course?: Course | null;
  onSaved?: (course: Course) => void;
}

export default function CourseForm({ mode, course, onSaved }: CourseFormProps) {
  const { createCourse, updateCourse, loading } = useCourse();

  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(course?.description || "");
  const [price, setPrice] = useState<number | "">(course?.price ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(course?.thumbnail || "");
  const [category, setCategory] = useState(course?.category || COURSE_CATEGORIES[0]);
  const [level, setLevel] = useState(course?.level || COURSE_LEVELS[0]);
  const [status, setStatus] = useState<Course["status"]>(course?.status || "draft");

  useEffect(() => {
    if (!course) return;
    setTitle(course.title);
    setDescription(course.description || "");
    setPrice(course.price ?? "");
    setThumbnailUrl(course.thumbnail || "");
    setCategory(course.category || COURSE_CATEGORIES[0]);
    setLevel(course.level || COURSE_LEVELS[0]);
    setStatus(course.status || "draft");
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please provide a course title.");
      return;
    }

    try {
      const input: CreateCourseInput | UpdateCourseInput = {
        title: title.trim(),
        description: description.trim() || null,
        price: price === "" ? 0 : price,
        thumbnail: thumbnailUrl || null,
        category,
        level,
        status,
      };

      if (mode === "create") {
        const newCourse = await createCourse(input as CreateCourseInput, null);
        toast.success("Course created successfully!");
        if (onSaved) onSaved(newCourse);
      } else if (course) {
        const updatedCourse = await updateCourse(course.id, input as UpdateCourseInput, null);
        toast.success("Course updated successfully!");
        if (onSaved) onSaved(updatedCourse);
      }
    } catch (err: any) {
      toast.error(err.message || "Unable to save course settings.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-50 text-violet-600">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-sm font-black tracking-tight">{mode === "create" ? "New Course Builder" : "Course Details"}</p>
            <p className="text-xs text-slate-400">Maintain your curriculum details and business metadata from a single form.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
        <div className="space-y-6">
          <Input
            label="Course title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. SaaS Product Management with Next.js"
            disabled={loading}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1 flex items-center gap-2">
              <FileText size={14} /> Description
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summarize what learners will achieve in this course."
              rows={5}
              className="w-full px-5 py-4 bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 font-medium text-sm outline-none transition-all resize-none disabled:opacity-60"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-violet-500"
                disabled={loading}
              >
                {COURSE_CATEGORIES.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="mt-2 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-violet-500"
                disabled={loading}
              >
                {COURSE_LEVELS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-600 ml-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Course["status"])}
                className="mt-2 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-violet-500"
                disabled={loading}
              >
                {COURSE_STATUSES.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Price (USD)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="0.00"
            disabled={loading}
          />
        </div>

        <div className="space-y-6">
          <UploadThumbnail
            initialValue={thumbnailUrl}
            onUploadComplete={(url) => setThumbnailUrl(url)}
          />

          <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Premium course settings</p>
                <p className="text-xs text-slate-500">Use strong categories and level labels to surface your course to learners.</p>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="rounded-3xl bg-white border border-slate-200 p-4 text-sm font-medium text-slate-600">
                <span className="font-black text-slate-900">Thumbnail</span> helps your course stand out in search.
              </div>
              <div className="rounded-3xl bg-white border border-slate-200 p-4 text-sm font-medium text-slate-600">
                <span className="font-black text-slate-900">Category</span> organizes your course inside marketplace channels.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] font-black text-slate-400">{mode === "create" ? "Draft a new course" : "Save course settings"}</p>
          <p className="text-sm text-slate-500">Changes are persisted to your instructor studio and available immediately.</p>
        </div>

        <Button type="submit" variant="primary" isLoading={loading} className="w-full sm:w-auto px-8 py-4 rounded-2xl">
          {mode === "create" ? "Publish course" : "Update course"}
        </Button>
      </div>
    </form>
  );
}
