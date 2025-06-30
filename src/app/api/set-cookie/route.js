import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req) {
  const { token } = await req.json();

  cookies().set("auth_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  revalidatePath("/");

  return NextResponse.json({ success: true });
}
