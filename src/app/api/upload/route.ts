import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServer();

    // Get form data
    const formData = await req.formData();

    // Get uploaded file
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Create unique filename
    const fileName = `${Date.now()}-${file.name}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("course-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("course-images")
      .getPublicUrl(fileName);

    return Response.json({
      success: true,
      url: publicUrl,
    });

  } catch (err) {
    console.error(err);

    return Response.json(
      { error: "Server error while uploading file" },
      { status: 500 }
    );
  }
}