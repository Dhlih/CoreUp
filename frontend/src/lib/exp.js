import { getSession } from "./session";

export const countExpLeft = async () => {
  try {
    const session = await getSession();

    const response = await fetch(
      "https://backend-itfest-production.up.railway.app/api/user",
      {
        headers: {
          Authorization: session.value,
        },
      }
    );
    const user = await response.json();

    const expPerLevel = 1000;
    const currentLevelStart = user.data.level * expPerLevel;
    const nextLevelExp = (user.data.level + 1) * expPerLevel;

    const expLeft = nextLevelExp - user.data.exp;
    const progress = ((user.data.exp - currentLevelStart) / expPerLevel) * 100;

    return {
      expLeft,
      progressValue: Math.round(progress),
    };
  } catch (error) {
    console.log(error);
  }
};
