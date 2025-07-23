export const countExpLeft = (currentExp, currentLevel) => {
  try {
    const expPerLevel = 1000; // Jumlah EXP yang dibutuhkan per level

    // Hitung EXP awal untuk level saat ini
    const currentLevelStart = currentLevel * expPerLevel;
    // Hitung total EXP yang dibutuhkan untuk mencapai level berikutnya
    const nextLevelExp = (currentLevel + 1) * expPerLevel;

    console.log("next level exp : ", nextLevelExp);

    // Hitung sisa EXP yang dibutuhkan untuk naik level
    const expLeft = nextLevelExp - currentExp;
    // Hitung progres dalam persentase untuk level saat ini
    const progress = ((currentExp - currentLevelStart) / expPerLevel) * 100;

    return {
      expLeft,
      nextLevelExp,
      progressValue: Math.round(progress), // Bulatkan nilai progres
    };
  } catch (error) {
    console.log("Error in countExpLeft:", error);
    // Kembalikan nilai default jika terjadi error
    return {
      expLeft: 0,
      nextLevelExp: 0,
      progressValue: 0,
    };
  }
};
