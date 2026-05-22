"use client";

import { useState } from "react";
import { GraduationCap } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/shared/ui/button";
import { enrollmentService } from "../services/enrollment.service";

interface EnrollButtonProps {
  courseId: string;
  studentId: string;
  initialStatus?: "pending" | "approved" | "rejected" | null;
}

export default function EnrollButton({ courseId, studentId, initialStatus = null }: EnrollButtonProps) {
  const [status, setStatus] = useState<string | null>(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleEnrollmentRequest = async () => {
    setLoading(true);
    try {
      await enrollmentService.submitEnrollmentRequest(studentId, courseId);
      setStatus("pending");
      toast.success("Enrollment request submitted to the instructor!");
    } catch (err: any) {
      toast.error(err.message || "Failed to log submission request.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "approved") {
    return (
      <div className="w-full text-center py-4 bg-emerald-50 text-emerald-600 border-2 border-emerald-100 font-black text-sm rounded-2xl">
        Access Active • Jump to Classroom
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="w-full text-center py-4 bg-amber-50 text-amber-600 border-2 border-amber-100 font-black text-sm rounded-2xl animate-pulse">
        Review Pending Instructor Decision
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="w-full text-center py-4 bg-rose-50 text-rose-600 border-2 border-rose-100 font-black text-sm rounded-2xl">
        Application Declined By Content Author
      </div>
    );
  }

  return (
    <Button
      onClick={handleEnrollmentRequest}
      variant="primary"
      isLoading={loading}
      className="w-full py-4 text-sm"
    >
      <GraduationCap size={18} />
      <span>Request Curriculum Entry</span>
    </Button>
  );
}