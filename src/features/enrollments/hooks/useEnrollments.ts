import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase-client";
import { enrollmentService } from "../services/enrollment.service";
import { EnrollmentRequest } from "../types/enrollment.types";

export function useEnrollments() {
  const [requests, setRequests] = useState<EnrollmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No active authentication account found.");

      const data = await enrollmentService.getInstructorEnrollmentRequests(user.id);
      setRequests(data);
    } catch (err: any) {
      setError(err.message || "Failed to capture enrollment information data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, error, refresh: fetchRequests };
}