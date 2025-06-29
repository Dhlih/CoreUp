export const getCourseProgress = (courses, quizzes) => {
  const progressMap = {};

  courses.forEach((course) => {
    let total = 0;
    let done = 0;

    // ambil semua module id dalam course
    const moduleIds = course.modules.map((mod) => mod.id);

    // hitung dari materials
    course.modules.forEach((mod) => {
      mod.materials.forEach((mat) => {
        total++;
        if (mat.is_done === 1) done++;
      });
    });

    // hitung dari quizzes yang cocok
    const relatedQuizzes = quizzes.filter((quiz) =>
      moduleIds.includes(quiz.module_id)
    );

    relatedQuizzes.forEach((quiz) => {
      total++;
      if (quiz.is_done === 1) done++;
    });

    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    progressMap[course.id] = percent;
  });

  console.log(progressMap);
  return progressMap;
};
