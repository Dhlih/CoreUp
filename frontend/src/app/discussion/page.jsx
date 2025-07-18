"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Funnel, Search } from "lucide-react";
import { getSession } from "@/lib/session";
import generateUsername from "@/lib/username";

export default function Discussion() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByCommentCount, setFilterByCommentCount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null); // 🔹 simpan ID user login
  const profileImageRef = useRef(null);
  const router = useRouter();

  const handleProfileClick = () => {
    console.log("Klik profil user");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterClick = () => {
    setFilterByCommentCount((prev) => !prev);
  };

  const filteredPosts = posts
    .filter((post) => {
      const descriptionMatch = post.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const nameMatch = post.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return descriptionMatch || nameMatch;
    })
    .sort((a, b) => {
      if (filterByCommentCount) {
        return (b.comments_count || 0) - (a.comments_count || 0);
      }
      return 0;
    });

  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();

      try {
        // 🔹 Ambil postingan
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: session.value,
          },
        });
        const data = await res.json();
        setPosts(data.data || []);
      } catch (error) {
        console.error("Gagal mengambil data postingan:", error);
      }

      try {
        // 🔹 Ambil profil user
        const profileRes = await fetch("https://coreup-api.up.railway.app/api/user", {
          headers: {
            "Content-Type": "application/json",
            Authorization: session.value,
          },
        });
        const profileData = await profileRes.json();
        setCurrentUserId(profileData.data.id);
      } catch (error) {
        console.error("Gagal mengambil data profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const SkeletonCard = () => (
    <div className="bg-[#0F171B] p-4 rounded-lg animate-pulse">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-10 h-10 bg-[#1c2a30] rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#1c2a30] rounded w-1/3" />
          <div className="h-3 bg-[#1c2a30] rounded w-1/4" />
        </div>
      </div>
      <div className="h-3 bg-[#1c2a30] rounded w-3/4 mb-1" />
      <div className="h-3 bg-[#1c2a30] rounded w-2/3" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#131F24] text-white px-4 md:px-20 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4 md:mb-2">Discussion</h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 w-full sm:max-w-md">
              <div className="flex items-center bg-[#0F171B] px-3 py-2 rounded-md w-full">
                <Search className="text-white/50 w-4 h-4 mr-2" />
                <input
                  type="text"
                  placeholder="Search Discussion..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="bg-transparent outline-none w-full placeholder:text-white/50 text-sm"
                />
              </div>
              <button
                onClick={handleFilterClick}
                className={`p-2 rounded-md border ${
                  filterByCommentCount
                    ? "bg-blue-600 border-blue-400"
                    : "bg-[#0F171B] border-white/10"
                }`}
              >
                <Funnel className="text-white/50 w-4 h-4" />
              </button>
            </div>

            <Link href="/create-discussion" className="w-full sm:w-auto">
              <button className="bg-blue-500 hover:bg-blue-600 text-sm font-medium px-4 py-2 rounded-md w-full sm:w-auto">
                Create Discussion
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filteredPosts.length === 0 ? (
          <p className="text-gray-400">Tidak ada postingan yang cocok.</p>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#0F171B] p-4 rounded-lg shadow hover:shadow-lg transition relative"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-4">
                  {post.user?.photo ? (
                    <img
                      src={post.user.photo}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-white/20 cursor-pointer"
                      alt={post.user.name || "User"}
                      onClick={handleProfileClick}
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full bg-[#131F24] border border-white/20 flex items-center justify-center cursor-pointer text-sm"
                      onClick={handleProfileClick}
                    >
                      {generateUsername(post.user?.name || "U")}
                    </div>
                  )}

                  <div>
                    <p className="font-semibold">{post.user?.name || "Anonim"}</p>
                    <p className="text-sm text-gray-400">
                      Posted{" "}
                      {post.created_at
                        ? new Date(post.created_at).toLocaleString()
                        : "unknown"}
                    </p>
                  </div>
                </div>

                {/* 🔹 Tombol titik tiga jika userId cocok */}
               {post.user?.id === currentUserId && (
  <div className="relative inline-block text-left">
    <button
      onClick={() => {
        const dropdown = document.getElementById(`dropdown-${post.id}`);
        dropdown.classList.toggle("hidden");
      }}
      className="text-white/70 hover:text-white"
    >
      ⋮
    </button>

    <div
      id={`dropdown-${post.id}`}
      className="absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-[#1c2a30] ring-1 ring-black ring-opacity-5 focus:outline-none hidden z-20"
    >
      <button
        onClick={() => router.push(`/create-discussion?id=${post.id}`)}
        className="block px-4 py-2 text-sm text-white hover:bg-blue-600 w-full text-left"
      >
        Edit
      </button>
      <button
        onClick={async () => {
          const confirmDelete = confirm("Yakin ingin menghapus postingan?");
          if (!confirmDelete) return;

          try {
            const session = await getSession();
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post.id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: session.value,
                },
              }
            );

            if (res.ok) {
              setPosts((prev) => prev.filter((p) => p.id !== post.id));
            } else {
              alert("Gagal menghapus postingan.");
            }
          } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat menghapus.");
          }
        }}
        className="block px-4 py-2 text-sm text-white hover:bg-red-600 w-full text-left"
      >
        Delete
      </button>
    </div>
  </div>
)}

              </div>

              <p className="text-sm text-gray-100">{post.description}</p>

              <div className="mt-2 text-sm text-gray-400 flex items-center gap-2">
                💬 {post.comments_count || 0}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
