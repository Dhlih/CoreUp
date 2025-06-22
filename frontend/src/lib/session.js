"use server";

import { cookies } from "next/headers";

export const createSession = async (token) => {
  try {
    const cookieStore = await cookies();

    cookieStore.set("token", `Bearer ${token}`, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSession = async () => {
  try {
    const cookieStore = await cookies();

    const session = cookieStore.get("token");
    return session;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSession = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return true;
  } catch (error) {
    console.log(error);
  }
};
