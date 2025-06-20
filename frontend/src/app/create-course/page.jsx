'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(''); // <== nama user dari API

  // 🔽 Ambil nama user dari /api/profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('https://backend-itfest-production.up.railway.app/api/profile', {
          headers: {
            Authorization: 'Bearer 4|m7szchdZu4jD8PdwsGXIVNJQaaOxWtz84XWj4Eld99f29086',
          },
        });

        const data = await res.json();
       setName(data.data.name || 'User'); 
      } catch (error) {
        console.error('Gagal ambil profil:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    if (!topic || !level || !language) {
      alert('Harap isi semua field.');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('https://backend-itfest-production.up.railway.app/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ topic, level, language }),
      });

      const data = await response.json();
      console.log('📦 Data respons dari server:', data);

      if (response.ok) {
        if (data.course?.id) {
          localStorage.setItem('course_id', data.course.id);
        }

        setTopic('');
        setLevel('');
        setLanguage('');
        router.push('/course');
      } else {
        alert(`❌ Gagal: ${data.message || 'Terjadi kesalahan pada data.'}`);
      }
    } catch (error) {
      alert('🚫 Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F171B] text-white p-6 pt-20">
      {loading ? (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  <p className="text-white text-sm font-medium">Create a course..</p>
</div>

      ) : (
        <div className="max-w-xl mx-auto space-y-6 mt-12">
          <div>
            <p className="text-lg md:text-xl font-medium mb-1">Hello {name}!</p>
            <h1 className="text-2xl md:text-4xl font-bold">What do you want to learn?</h1>
          </div>

          <input
            type="text"
            placeholder="Enter topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-[#1E293B] placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Enter language..."
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-[#1E293B] placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-[#1E293B] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>Select level </option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

       
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold"
              disabled={loading}
            >
              Create Roadmap
            </button>

           
        </div>
      )}
    </div>
  );
}
