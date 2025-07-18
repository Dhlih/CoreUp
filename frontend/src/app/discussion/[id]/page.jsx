"use client";

import { LuSendHorizontal } from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSession } from "@/lib/session";

const DiscussionById = () => {
  const [post, setPost] = useState("");
  const [session, setSession] = useState("");
  const [comment, setComment] = useState("");

  const params = useParams();
  const id = params.id;

  const fetchData = async () => {
    const session = await getSession();
    setSession(session.token);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: session.token,
        },
      }
    );

    const data = await response.json();
    console.log("data : ", data);
    setPost(data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createComment = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session,
        },
        body: JSON.stringify({ comment }),
      }
    );
    if (response.ok) {
      fetchData();
    }
  };

  return (
    <div className="py-[4rem] md:px-30 px-[1.5rem]">
      <div className="bg-[#0F171B] rounded-lg p-8">
        <div className="flex items-center space-x-[1rem]">
          <img
            src="/images/luffy.webp"
            className="w-14 h-14 rounded-full object-cover"
            alt=""
          />
          <div>
            <div className="flex items-center space-x-[0.8rem]">
              <h3 className="font-semibold text-lg">Ifad Yusuf</h3>
            </div>
            <p className="opacity-80 "> {post?.created_at}</p>
          </div>
        </div>
        <p className="my-[1rem] text-lg">{post?.description}</p>
        {post?.photo && (
          <img
            src={post.photo}
            className="w-full max-h-[500px] object-cover rounded-lg"
          />
        )}
      </div>

      {/* comments */}
      <div className="mt-[2rem] flex flex-col space-y-[1.5rem] ">
        <h2 className="text-2xl font-semibold ">13 Comments</h2>

        {/* add comment */}
        <div className="rounded-lg p-6 bg-[#0F171B]">
          <div className="flex space-x-[1.5rem]">
            <img
              src="/images/luffy.webp"
              className="w-12 h-12 rounded-full object-cover"
              alt=""
            />
            <div className="rounded-lg p-3 bg-[#131F24] w-full relative">
              <textarea
                className="resize-none w-full pr-10 pb-10 rounded-lg p-3 bg-[#131F24] text-white outline-none"
                placeholder="Write your comment here"
                rows={2}
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
              <LuSendHorizontal
                className="absolute bottom-3 right-3 cursor-pointer text-white text-2xl"
                title="Create"
                onClick={createComment}
              />
            </div>
          </div>
        </div>

        <div className="mt-[1rem]">
          {post?.comments?.map((comment) => (
            <div className="rounded-lg p-6 bg-[#0F171B] ">
              <div className="flex items-center space-x-[1rem]">
                <img
                  src="/images/luffy.webp"
                  className="w-12 h-12 rounded-full object-cover"
                  alt=""
                />
                <div className="flex justify-between w-full">
                  <h3 className="font-semibold">Ifad Yusuf</h3>
                  <p className="opacity-80 text-sm">3 hour ago</p>
                </div>
              </div>

              <p className="mt-[1rem]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
                totam, facere tenetur, excepturi similique nesciunt, aut id
                voluptates at fugit illo possimus quis vero repellendus sint
                laudantium. Aut modi velit adipisci porro distinctio numquam et
                dolorem, corrupti eaque eius deleniti accusantium soluta omnis
                nesciunt cupiditate.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscussionById;
