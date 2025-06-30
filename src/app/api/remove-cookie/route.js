// In your logout handler (e.g., app/api/logout/route.js)
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST() {
  // Clear the auth cookie
  cookies().delete("auth_token");

  // Revalidate any cached paths
  revalidatePath("/question-bank");
  revalidatePath("/");

  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}
