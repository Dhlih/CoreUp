'use client';

import { useState, useEffect } from 'react';

export default function CoursePage() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch('https://backend-itfest-production.up.railway.app/api/courses/3', {
          headers: {
            'Authorization': 'Bearer 4|m7szchdZu4jD8PdwsGXIVNJQaaOxWtz84XWj4Eld99f29086'
          }
        });
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#131F24] text-white p-6 pt-25 px-20">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{course.title}</h1>
       
      </div>
      <p className="text-sm mb-4">{course.description}</p>
      {course.modules.map((module, index) => (
        <div key={module.id} className="mb-6">
          <div className="flex justify-between items-center mb-2">
  <h2 className="text-xl font-semibold">{module.title}</h2>
  <button className="bg-blue-500 text-white px-4 py-2 rounded">Quiz</button>
</div>
          {module.materials.map((material) => (
            <div key={material.id} className="bg-[#0F171B] p-4 rounded-[10px]  mb-2 flex items-center">
              <img
  src="/images/icon_book.webp"
  alt="Icon Buku"
  className="w-6 h-6 mr-4"
/>

              <div>
                <p className="font-medium">{material.title}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}