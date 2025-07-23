import { NextResponse } from "next/server";
import { getSession } from "./lib/session";

export async function middleware(request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/create-course",
    "/my-courses/:path*",
    "/profile",
    "/discussion",
    "/create-discussion",
    "/leaderboard",
  ],
};
