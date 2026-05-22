import InstructorRequestsDashboard from "@/features/courses/components/InstructorRequestsDashboard";

export const metadata = {
  title: "Enrollment Requests | Instructor Studio Classroom",
  description: "Approve or decline incoming student authorization program nodes.",
};

export default function InstructorRequestsPage() {
  return (
    <div className="py-6">
      <InstructorRequestsDashboard />
    </div>
  );
}