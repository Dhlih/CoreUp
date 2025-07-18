import { getSession } from "./session";
import axios from "axios";

export const getCourseProgress = async () => {
  try {
    const session = await getSession();

    // fetch courses
    const courseRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
      {
        headers: {
          Authorization: session.token,
        },
      }
    );

    // fetch quiz-user
    const quizRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/quiz-user`,
      {
        headers: {
          Authorization: session.token,
        },
      }
    );

    const courses = courseRes.data;
    const quizzes = quizRes.data;

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
      // {
      //   "c1": 80,
      //   "c2": 45,
      // }
      progressMap[course.id] = percent;
    });

    console.log(progressMap);
    return progressMap;
  } catch (err) {
    console.error("Gagal memuat data course dan quiz:", err);
  }
};
