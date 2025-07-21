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

// Tambahkan fungsi untuk update session
export const updateSession = async (updatedUserData) => {
  try {
    const cookieStore = cookies();
    const currentSession = await getSession();

    if (!currentSession) {
      throw new Error("No session found");
    }

    // Merge data session lama dengan data baru
    const updatedSession = {
      ...currentSession,
      ...updatedUserData,
    };

    // Update cookie dengan data baru
    cookieStore.set("user_session", JSON.stringify(updatedSession), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return updatedSession;
  } catch (error) {
    console.log("gagal update session :", error);
    throw error;
  }
};

export const refreshSession = async () => {
  try {
    const currentSession = await getSession();

    if (!currentSession) {
      throw new Error("No session found");
    }

    // Fetch updated user data from API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: currentSession.token,
        },
      }
    );

    const user = await response.json();

    // Update session dengan data terbaru dari API
    const updatedSession = {
      token: currentSession.token,
      name: user.data.name,
      email: user.data.email,
      photo: user.data.photo,
      level: user.data.level,
      exp: user.data.exp,
      id: user.data.id,
    };

    const cookieStore = cookies();
    cookieStore.set("user_session", JSON.stringify(updatedSession), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return updatedSession;
  } catch (error) {
    console.log("gagal refresh session :", error);
    throw error;
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
