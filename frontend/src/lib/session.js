"use server";

import { cookies } from "next/headers";

export const createSession = async (token) => {
  const cookieStore = await cookies();

  cookieStore.set("token", `Bearer ${token}`, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
  });
};

export const getSession = async () => {
  const cookieStore = await cookies();

  const session = cookieStore.get("token");
  return session;
};
