import { getSession } from "./session";

export const countExpLeft = async () => {
  try {
    const session = await getSession();

    const expPerLevel = 1000;
    const currentLevelStart = session.level * expPerLevel;
    const nextLevelExp = (session.level + 1) * expPerLevel; // 1000

    console.log("next level exp : ", nextLevelExp);

    const expLeft = nextLevelExp - session.exp;
    const progress = ((session.exp - currentLevelStart) / expPerLevel) * 100;

    return {
      expLeft,
      nextLevelExp,
      progressValue: Math.round(progress),
    };
  } catch (error) {
    console.log(error);
  }
};
