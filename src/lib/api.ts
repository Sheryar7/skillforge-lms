
import { Course } from "@/types/lms";

// Fake API (replace with real backend later)
export async function getCourses(): Promise<Course[]> {
  const res = await fetch("https://dummyjson.com/products"); // demo API

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  const data = await res.json();

  // Convert API data into your LMS format
  return data.products.map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    instructor: "John Doe",
  }));
}