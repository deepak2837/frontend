import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST() {
  try {
    const cookieStore = cookies();
    
    // Clear the auth cookie with explicit options
    cookieStore.delete("auth_token", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "Strict"
    });
    
    // Also try to clear any other potential auth cookies
    cookieStore.delete("token", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "Strict"
    });

    // Revalidate all important paths
    revalidatePath("/");
    revalidatePath("/question-bank");
    revalidatePath("/mock-test");
    revalidatePath("/pyq");
    revalidatePath("/case-studies");
    revalidatePath("/virtual-surgery");
    revalidatePath("/profile");
    revalidatePath("/records");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error removing cookies:", error);
    return NextResponse.json({
      success: false,
      message: "Error removing cookies",
      error: error.message
    }, { status: 500 });
  }
}
