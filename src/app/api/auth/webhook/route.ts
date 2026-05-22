import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate custom webhook secret handshake configuration if set in environment parameters
    const webhookSecret = request.headers.get("x-supabase-webhook-secret");
    if (process.env.SUPABASE_WEBHOOK_SECRET && webhookSecret !== process.env.SUPABASE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized endpoint trigger signature" }, { status: 401 });
    }

    const { record, type } = body;

    // Listen strictly to "INSERT" authentication creation hooks
    if (type === "INSERT" && record) {
      const { id, email, raw_user_meta_data } = record;
      const assignedRole = raw_user_meta_data?.role || "student";

      // FIX 1 & 2: Initialize the server client instance correctly by awaiting the builder function
      const supabase = await createSupabaseServer();

      // Injecting the record securely into your custom schema table bypassing typical RLS parameters
      // FIX 3: Reference your initialized 'supabase' variable here instead of the broken 'supabaseServer' reference
      const { error: dbError } = await supabase
        .from("profiles") // Matches your user database schema tracking profiles
        .insert([
          {
            id: id,
            email: email,
            role: assignedRole,
            updated_at: new Date().toISOString(),
          }
        ]);

      if (dbError) {
        return NextResponse.json({ error: `Sync execution failure: ${dbError.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: "Database profiles system synchronized securely" });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal system sync exception" }, { status: 500 });
  }
}