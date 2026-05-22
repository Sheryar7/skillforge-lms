import { NextResponse } from "next/server";
// FIX 1: Import the correct builder function name from your library helper
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    // 1. Resolve Authorization Header Session
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized access attempt" }, { status: 401 });
    }

    // FIX 2: Initialize the scoped server instance cleanly for this request thread
    const supabase = await createSupabaseServer();

    const token = authHeader.replace("Bearer ", "");
    // FIX 3: Use the initialized instance ('supabase') instead of 'supabaseServer'
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid authentication session" }, { status: 401 });
    }

    // 2. Strict Role Enforcement Check
    if (user.user_metadata?.role !== "instructor") {
      return NextResponse.json({ error: "Forbidden: Instructor privileges required" }, { status: 403 });
    }

    // 3. Extract Payload Configurations
    const body = await request.json();
    const { fileName, fileType } = body;

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "Missing required file metadata parameter configurations" }, { status: 400 });
    }

    // 4. Generate Pre-signed Upload URL target path via Supabase Storage
    const fileFilePath = `${user.id}/${Date.now()}-${fileName}`;
    // FIX 4: Use the initialized instance here as well
    const { data, error: storageError } = await supabase.storage
      .from("lessons-videos") 
      .createSignedUploadUrl(fileFilePath);

    if (storageError) {
      return NextResponse.json({ error: "Failed to allocate secure storage pipeline node" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      uploadUrl: data.signedUrl,
      path: fileFilePath,
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server route disruption" }, { status: 500 });
  }
}