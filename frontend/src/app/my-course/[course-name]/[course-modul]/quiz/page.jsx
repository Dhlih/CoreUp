"use client";

import OptionCard from "@/components/OptionCard";
import { useEffect, useState } from "react";

const Quiz = () => {
  const [indexQuestion, setIndexQuestion] = useState(0);

  useEffect(() => {
    console.log(indexQuestion);
  }, [indexQuestion]);

  const questions = [
    {
      id: 1,
      question: "Apa tujuan utama dari public speaking?",
      options: [
        { text: "Membuat audiens tertawa", isCorrect: false },
        {
          text: "Menyampaikan informasi, mempengaruhi, atau menghibur audiens",
          isCorrect: true,
        },
        {
          text: "Memperlihatkan kemampuan berbicara seseorang",
          isCorrect: false,
        },
        { text: "Mengisi waktu luang dalam acara", isCorrect: false },
      ],
    },
    {
      id: 2,
      question: "Manakah yang termasuk elemen penting dalam public speaking?",
      options: [
        { text: "Suara, penampilan, dan tempat duduk", isCorrect: false },
        { text: "Naskah, air minum, dan pakaian", isCorrect: false },
        { text: "Pesan, audiens, dan pembicara", isCorrect: true },
        { text: "Mic, panggung, dan kamera", isCorrect: false },
      ],
    },
    {
      id: 3,
      question:
        "Apa yang dimaksud dengan 'audience analysis' dalam public speaking?",
      options: [
        { text: "Menghitung jumlah penonton", isCorrect: false },
        { text: "Menganalisis gaya bicara pembicara", isCorrect: false },
        {
          text: "Memahami karakteristik, kebutuhan, dan harapan audiens",
          isCorrect: true,
        },
        { text: "Menilai isi materi presentasi", isCorrect: false },
      ],
    },
    {
      id: 4,
      question:
        "Salah satu cara mengatasi rasa gugup saat berbicara di depan umum adalah...",
      options: [
        { text: "Menghindari kontak mata dengan audiens", isCorrect: false },
        {
          text: "Berlatih dan mempersiapkan materi dengan baik",
          isCorrect: true,
        },
        { text: "Berbicara lebih cepat agar cepat selesai", isCorrect: false },
        { text: "Membaca teks tanpa melihat audiens", isCorrect: false },
      ],
    },
    {
      id: 5,
      question:
        "Mengapa penting untuk melakukan kontak mata saat public speaking?",
      options: [
        {
          text: "Agar pembicara terlihat percaya diri dan membangun koneksi dengan audiens",
          isCorrect: true,
        },
        { text: "Untuk membuat audiens merasa tidak nyaman", isCorrect: false },
        { text: "Supaya tidak lupa dengan materi", isCorrect: false },
        { text: "Karena itu bagian dari aturan berpakaian", isCorrect: false },
      ],
    },
  ];

  const updateIndexQuestion = (isIncrease) => {
    const currentIndex = indexQuestion + 1;

    if (isIncrease) {
      if (currentIndex <= questions.length - 1) {
        setIndexQuestion(indexQuestion + 1);
        console.log(indexQuestion, questions.length - 1);
      }
    } else {
      if (indexQuestion > 0) {
        setIndexQuestion(indexQuestion - 1);
      }
    }
  };

  return (
    <div className="max-w-[1350px] mx-auto mt-[5rem] pb-[5rem] md:px-0 px-[2rem]">
      <div>
        <div className="flex md:flex-row flex-col md:items-center justify-between">
          <h2 className="text-xl font-semibold  md:text-left text-center opacity-80">
            Modul 1: Dasar-dasar Public Speaking
          </h2>
        </div>

        {/* question */}

        <p className="md:text-3xl text-2xl font-semibold md:max-w-[80%] w-full leading-12 md:text-left text-center mt-[0.5rem]">
          {indexQuestion + 1}. {questions[indexQuestion].question}
        </p>

        {/* answer option */}
        <div className="mt-[2rem] rounded-md space-y-[2rem]">
          {questions[indexQuestion].options.map((option, idx) => (
            <OptionCard key={idx} optionText={option.text} />
          ))}
        </div>
      </div>

      <div
        className={`flex items-center mt-[3rem] ${
          indexQuestion > 0 ? "justify-between" : "justify-end"
        }`}
      >
        {indexQuestion > 0 && (
          <button
            className="btn bg-[#3B82F6] py-6 md:px-12 px-8 rounded-lg text-lg  max-w-[200px]"
            onClick={() => updateIndexQuestion(false)}
          >
            Previous
          </button>
        )}
        <button
          className="btn bg-[#3B82F6] py-6 md:px-12 px-8 rounded-lg text-lg  max-w-[200px]"
          onClick={() => updateIndexQuestion(true)}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Quiz;
