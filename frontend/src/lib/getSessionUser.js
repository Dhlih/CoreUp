"use server";

import { cookies } from "next/headers";

export const getSessionUser = async () => {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get("token");
    if (!session) return null;

    const token = session.token;

    const res = await fetch("https://coreup-api.up.railway.app/api/user", {
      headers: {
        Authorization: token,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const user = await res.json();
    return user;
  } catch (error) {
    console.error("Failed to get session user:", error);
    return null;
  }
};
