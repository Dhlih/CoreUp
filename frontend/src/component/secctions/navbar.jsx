'use client';
import { useEffect, useState } from 'react';
import ModalLogin from '../ui/modal_login';
import ModalDaftar from '../ui/modal_register';


export default function Navbar() {
  const [hasMounted, setHasMounted] = useState(false); // 👈 tambahan
  const [token, setToken] = useState(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [photo, setPhoto] = useState('/images/makima.webp');
  useEffect(() => {
    setHasMounted(true); // client sudah mount

    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);

      // Ambil data profil
      fetch('https://backend-itfest-production.up.railway.app/api/profile', {
        headers: {
          Authorization: savedToken,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setName(data.data.name);
          setUsername(data.data.email.split('@')[0]);
          setPhoto('/images/makima.webp');
        });
    }
  }, []);

  // ⛔ jangan render apapun sebelum mounting
  if (!hasMounted) return null;

  return (
    <div className="navbar fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-lg shadow-md border-b border-white/20 px-10">
      <div className="flex-1">
        <a className="text-xl font-bold text-white">CoreUp</a>
      </div>

      {token ? (
        <div className="flex items-center gap-4">
          <ul className="hidden md:flex gap-6 text-sm font-medium text-white">
            <li className="cursor-pointer hover:text-blue-400">Leaderboard</li>
            <li className="cursor-pointer hover:text-blue-400">My Course</li>
          </ul>
          <button className="btn btn-primary text-white text-sm font-medium px-4 py-2 rounded">
            Create
          </button>
          <div className="flex items-center gap-2">
            <img
              src={photo}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover border border-white/20"
            />
            <div className="hidden md:block">
              <p className="font-semibold text-sm leading-tight">{name}</p>
              <p className="text-xs text-gray-400">@{username}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <ModalLogin />
          <ModalDaftar />
          <button
            className="btn bg-[#131F24] text-white shadow-md hover:brightness-110 transition text-sm"
            onClick={() => document.getElementById('modal_login').showModal()}
          >
            Login
          </button>
          <button
            className="btn btn-primary text-white shadow-md hover:opacity-90 transition text-sm"
            onClick={() => document.getElementById('modal_daftar').showModal()}
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
}
