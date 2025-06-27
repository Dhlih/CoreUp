export const getCourseProgress = (course) => {
  let totalTasks = 0;
  let completedTasks = 0;

  course.modules.forEach((module) => {
    // Hitung semua materi
    module.materials.forEach((material) => {
      totalTasks++;
      if (material.is_done === 1) completedTasks++;
    });

    // Anggap semua quiz selesai (kamu bisa ganti logika ini sesuai DB user)
    module.quizzes.forEach((quiz) => {
      totalTasks++;
      // Misal quiz disimpan dengan is_done, atau simulasikan quiz selesai:
      // if (quiz.is_done === 1) completedTasks++;
      // Anggap user jawab semua quiz pertama saja untuk contoh:
      if (quiz.id === 1 || quiz.id === 6 || quiz.id === 11) {
        completedTasks++;
      }
    });
  });

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  return progress;
};

// Contoh panggil:
const progress = calculateCourseProgress(courseData); // Misal courseData dari API
console.log(`Progress: ${progress}%`);
