"use server";

import { cookies } from "next/headers";

export const createSession = async (token) => {
  try {
    const cookieStore = cookies();

    // Fetch user data from API using the token
    console.log("token :", token);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const user = await response.json();

    // Store session in cookies
    cookieStore.set(
      "user_session",
      JSON.stringify({
        token: `Bearer ${token}`,
        name: user.data.name,
        email: user.data.email,
        photo: user.data.photo,
        level: user.data.level,
        exp: user.data.exp,
        id: user.data.id,
      }),
      {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
      }
    );
  } catch (error) {
    console.log("gagal membuat session :", error);
  }
};

export const getSession = async () => {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("user_session");
    return session ? JSON.parse(session.value) : null;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSession = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("user_session");
    return true;
  } catch (error) {
    console.log(error);
  }
};
