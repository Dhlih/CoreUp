import { NextResponse } from "next/server";
import { getSession } from "./lib/session";

export async function middleware(request) {
  const session = await getSession();

  const protectedPaths = [
    "/create-course",
    "/my-courses",
    "/my-courses/", // pastikan cocok dengan /my-courses/
  ];

  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/create-course", "/my-courses/:path*", "/my-courses"],
};
