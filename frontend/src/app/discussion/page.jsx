"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";
import { MdOutlineFilterAlt } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineModeEdit } from "react-icons/md";

import { getSession } from "@/lib/session";
import generateUsername from "@/lib/username";
import { timeAgo } from "@/lib/time";

export default function Discussion() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByCommentCount, setFilterByCommentCount] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const profileImageRef = useRef(null);
  const router = useRouter();
  const [selectedPostId, setSelectedPostId] = useState(null);

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
      const descriptionMatch = post.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const nameMatch = post.user?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: session.token,
            },
          }
        );

        const baseData = await res.json();

        const basePosts = baseData.data || [];

        const postsWithComments = await Promise.all(
          basePosts.map(async (post) => {
            try {
              const detailRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post.id}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: session.token,
                  },
                }
              );

              const detailData = await detailRes.json();
              return {
                ...post,
                comments_count: detailData.data.comments?.length || 0,
              };
            } catch (err) {
              console.error(
                `Gagal ambil komentar untuk post ID ${post.id}`,
                err
              );
              return { ...post, comments_count: 0 };
            }
          })
        );

        setPosts(postsWithComments);
      } catch (error) {
        console.error("Gagal mengambil data postingan:", error);
      }

      try {
        const profileRes = await fetch(
          "https://coreup-api.up.railway.app/api/user",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: session.token,
            },
          }
        );

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
    <div className="bg-[#0F171B] p-6 rounded-lg animate-pulse">
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
    <div className=" bg-[#131F24] text-white md:px-30 px-[1.5rem]  py-[3rem] relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl md:text-4xl font-bold mb-[1rem]">
            Discussion
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-4 w-full sm:max-w-md">
              <div className="flex items-center bg-[#0F171B] px-3 py-2 rounded-lg md:w-[20rem] w-full">
                <IoIosSearch className="text-white/50 mr-2 text-2xl" />
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
                className={`p-2 rounded-md cursor-pointer  ${
                  filterByCommentCount
                    ? "bg-blue-600 border-blue-400"
                    : "bg-[#0F171B] border-white/10"
                }`}
              >
                <MdOutlineFilterAlt className="text-white/50 text-2xl" />
              </button>
            </div>

            <Link href="/create-discussion" className="  md:block hidden">
              <button className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-sm font-medium px-4 py-3 rounded-md w-full sm:w-auto">
                Create Discussion
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* comment lists */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col space-y-[2rem]">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredPosts.length === 0 ? (
          <p className="text-gray-400">No posts yet...</p>
        ) : (
          <div className="flex flex-col space-y-[2rem]">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-[#0F171B] hover:bg-[#0F171B]/70 p-4 rounded-lg shadow transition relative flex flex-col space-y-[1rem]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {post.user?.photo ? (
                      <img
                        src={post.user.photo}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border border-white/20 cursor-pointer"
                        alt={post.user.name || "User"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProfileClick();
                        }}
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full bg-[#131F24] border border-white/20 flex items-center justify-center cursor-pointer text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProfileClick();
                        }}
                      >
                        {generateUsername(post?.user?.name)}
                      </div>
                    )}

                    <div>
                      <p className="font-semibold">
                        {post.user?.name || "Anonim"}
                      </p>
                      <p className="text-sm text-gray-400">
                        Posted {timeAgo(post.created_at)}
                      </p>
                    </div>
                  </div>

                  {post.user?.id === currentUserId && (
                    <div
                      className="relative inline-block text-left"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const dropdown = document.getElementById(
                            `dropdown-${post.id}`
                          );
                          dropdown.classList.toggle("hidden");
                        }}
                        className="text-white/70 hover:text-white cursor-pointer"
                      >
                        <BsThreeDots className="text-xl" />
                      </button>

                      <div
                        id={`dropdown-${post.id}`}
                        className="bg-[#212C31] absolute top-8 right-0 rounded-lg z-50 min-w-[120px] shadow-lg hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="flex items-center space-x-[1rem] hover:bg-[#0F171B]/70 px-3 py-2 cursor-pointer"
                          onClick={() => {
                            router.push(`/create-discussion?id=${post.id}`);
                          }}
                        >
                          <MdOutlineModeEdit className="text-xl" />
                          <p>Edit</p>
                        </div>
                        <div
                          className="flex items-center space-x-[1rem] hover:bg-[#0F171B]/70 px-4 py-3 cursor-pointer"
                          onClick={() => {
                            setSelectedPostId(post.id);
                            document.getElementById("delete_modal").showModal();
                          }}
                        >
                          <AiOutlineDelete className="text-red-400 text-xl" />
                          <p>Delete</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="cursor-pointer space-y-[0.5rem]"
                  onClick={() => router.push(`/discussion/${post.id}`)}
                >
                  <p className="text-lg text-gray-100 hover:text-gray-100/70">
                    {post.description}
                  </p>

                  <div className="text-gray-400 flex items-center space-x-[0.8rem]">
                    <FaRegComment className="text-xl" />
                    <p>{post.comments_count || 0} comments</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <dialog id="delete_modal" className="modal">
        <div className="modal-box bg-[#1c2a30] text-white">
          <h3 className="font-bold text-lg">Delete Post?</h3>
          <p className="py-4">
            The post will be permanently deleted. Continue?
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-outline">Cancel</button>
              <button
                className="btn bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  try {
                    const session = await getSession();
                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${selectedPostId}`,
                      {
                        method: "DELETE",
                        headers: {
                          Authorization: session.token,
                        },
                      }
                    );

                    if (res.ok) {
                      setPosts((prev) =>
                        prev.filter((p) => p.id !== selectedPostId)
                      );
                    } else {
                      alert("Gagal menghapus postingan.");
                    }
                  } catch (error) {
                    console.error("Error:", error);
                    alert("Terjadi kesalahan saat menghapus.");
                  } finally {
                    setSelectedPostId(null);
                  }
                }}
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* create discussion mobile button */}
      <Link href="/create-discussion">
        <div
          className="md:hidden fixed flex items-center justify-center bottom-10 right-6 w-12 h-12 rounded-full bg-[#3B82F6] hover:bg-[#3B82F6]/70 cursor-pointer shadow-lg transition-all"
          title="Create discussion"
        >
          <IoIosAdd className="text-4xl text-white" />
        </div>
      </Link>
    </div>
  );
}
