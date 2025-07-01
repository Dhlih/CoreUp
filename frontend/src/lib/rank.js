import { getSession } from "./session";

export const getUserRank = async () => {
  try {
    const session = await getSession();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/all`,
      {
        headers: {
          Authorization: session.value,
        },
      }
    );
    const result = await response.json();

    const sortedUsers = result.data.sort((a, b) => b.exp - a.exp);

    const userResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
      {
        headers: {
          Authorization: session.value,
        },
      }
    );
    const userData = await userResponse.json();
    const currentUserId = userData.data.id;

    const userRankIndex = sortedUsers.findIndex(
      (user) => user.id === currentUserId
    );

    return {
      userRank: userRankIndex + 1,
      sortedUsers,
    };
  } catch (error) {
    console.log("Gagal mendapatkan ranking user:", error);
  }
};
