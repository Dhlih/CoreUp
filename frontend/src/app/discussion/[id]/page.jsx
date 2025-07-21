"use client";

import { LuSendHorizontal } from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "@/lib/session";
import { timeAgo } from "@/lib/time";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineModeEdit } from "react-icons/md";
import generateUsername from "@/lib/username";

import ErrorAlert from "@/components/ErrorAlert";
import Alert from "@/components/SuccessAlert";
import ConfirmationModal from "@/components/ConfirmationModal";

const DiscussionById = () => {
  const [post, setPost] = useState(null);
  const [session, setSession] = useState(null);
  const [comment, setComment] = useState("");
  const [activeOptionId, setActiveOptionId] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [isEditPost, setIsEditPost] = useState(false);
  const [editedPostContent, setEditedPostContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeletePost, setIsDeletePost] = useState(false);
  const [isDeleteComment, setIsDeleteComment] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [showOption, setShowOption] = useState(false);

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const fetchData = async () => {
    try {
      const sessionData = await getSession();
      setSession(sessionData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionData.token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }

      const data = await response.json();
      console.log(data.data);
      setPost(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setErrorAlert("Gagal memuat data.");
      setLoading(false);
    }
  };

  const createComment = async () => {
    if (!comment.trim()) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: session.token,
          },
          body: JSON.stringify({ comment }),
        }
      );

      if (response.ok) {
        setSuccessAlert("Created new comment");
        setComment("");
        fetchData();
      }

      setTimeout(() => {
        setSuccessAlert(false);
      }, 1500);
    } catch (error) {
      setErrorAlert("Failed to create comment.");
    }
  };

  const deletePost = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: session.token,
          },
        }
      );

      if (response.ok) {
        setSuccessAlert("Deleted successfully");
        setTimeout(() => {
          setSuccessAlert(false);
          router.push("/discussion");
        }, 1500);
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      setErrorAlert("Failed to delete post.");
    }
  };

  const deleteComment = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${activeOptionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: session.token,
          },
        }
      );

      if (response.ok) {
        fetchData();
        setIsDeleteComment(false);
        setActiveOptionId(null);
        setSuccessAlert("Deleted successfully");

        setTimeout(() => {
          setSuccessAlert(false);
        }, 1500);
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      setErrorAlert("Failed to delete comment.");
    }
  };

  const updatePost = async () => {
    if (!editedPostContent.trim()) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: session.token,
          },
          body: JSON.stringify({ description: editedPostContent }),
        }
      );

      if (response.ok) {
        setIsEditPost(false);
        setSuccessAlert("Post updated successfully");
        fetchData();
        setTimeout(() => setSuccessAlert(false), 1500);
      } else {
        throw new Error("Failed to update post");
      }
    } catch (error) {
      setErrorAlert("Failed to update post.");
      console.log(error);
    }
  };

  const updateComment = async () => {
    if (!editedComment.trim()) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${editCommentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: session.token,
          },
          body: JSON.stringify({ comment: editedComment }),
        }
      );

      if (response.ok) {
        setEditCommentId(null);
        setEditedComment("");
        setSuccessAlert("Comment updated successfully");

        fetchData();
        setTimeout(() => setSuccessAlert(false), 1500);
      } else {
        throw new Error("Failed to update comment");
      }
    } catch (error) {
      setErrorAlert("Failed to update comment.");
      console.log(error);
    }
  };

  const PostSkeleton = () => (
    <div className="bg-[#0F171B] rounded-lg p-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-[1rem]">
          <div className="w-14 h-14 rounded-full bg-gray-700"></div>
          <div>
            <div className="h-6 bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-20"></div>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
      <div className="mt-4 h-64 bg-gray-700 rounded-lg"></div>
    </div>
  );

  const CommentSkeleton = () => (
    <div className="rounded-lg p-6 bg-[#0F171B] animate-pulse ">
      <div className="flex items-center  justify-between ">
        <div className="flex items-center space-x-[1rem]">
          <div className="w-12 h-12 rounded-full bg-gray-700 " />
          <div>
            <div className="h-4 w-[50px] bg-gray-700 rounded mb-1"></div>
            <div className="h-3 w-[80px] bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
      <div className="mt-4 h-4 bg-gray-700 rounded w-full" />
      <div className="mt-2 h-4 bg-gray-700 rounded w-2/3" />
    </div>
  );

  useEffect(() => {
    fetchData();
  }, []);

  if (loading || !post || !session) {
    return (
      <div className="py-[4rem] md:px-30 px-[1.5rem] relative">
        <PostSkeleton />
        <div className="mt-[2rem] flex flex-col space-y-[1.5rem]">
          <div className="h-8 bg-gray-700 rounded w-32 animate-pulse"></div>
          <div className="bg-[#0F171B] rounded-lg p-6 animate-pulse">
            <div className="flex space-x-[1.5rem]">
              <div className="w-12 h-12 rounded-full bg-gray-700"></div>
              <div className="w-full h-20 bg-gray-700 rounded-lg"></div>
            </div>
          </div>
          <div className="space-y-[2rem]">
            {[1, 2, 3].map((i) => (
              <CommentSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-[4rem] md:px-30 px-[1.5rem] relative">
      <div className="bg-[#0F171B] rounded-lg md:p-8 p-6">
        <div className="flex items-center justify-between ">
          <div className="flex items-center space-x-[1rem]">
            {post.user.photo ? (
              <img
                src={post.user.photo}
                className="md:w-14 md:h-14 w-12 h-12 rounded-full object-cover"
                alt=""
              />
            ) : (
              <div
                className="md:w-14 md:h-14 w-12 h-12 bg-[#131F24] rounded-full border border-white/20 flex items-center justify-center"
                style={{ aspectRatio: 1 }}
              >
                <p className="text-base leading-none">
                  {generateUsername(session?.name)}
                </p>
              </div>
            )}
            <div>
              <div className="flex items-center space-x-[0.8rem]">
                <h3 className="font-semibold ">{post.user.name}</h3>
              </div>
              <p className="opacity-80 text-sm">{timeAgo(post.created_at)}</p>
            </div>
          </div>

          {session.id === post.user_id && (
            <div className="relative">
              <BsThreeDots
                className="text-xl cursor-pointer"
                onClick={() => setShowOption(!showOption)}
              />
              {showOption && (
                <div className="bg-[#212C31] absolute top-8 right-0 rounded-lg z-50 min-w-[120px] shadow-lg">
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
                      setIsDeletePost(true);
                      setShowOption(false);
                    }}
                  >
                    <AiOutlineDelete className="text-red-400 text-xl" />
                    <p>Delete</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="my-[1rem] md:text-xl  whitespace-pre-wrap">
          {post?.description}
        </p>

        {post?.photo && !isEditPost && (
          <img
            src={post?.photo}
            className="w-full max-h-[450px] object-cover rounded-lg"
            alt="Post content"
          />
        )}
      </div>

      <div className="mt-[2rem] flex flex-col space-y-[1.5rem] ">
        <h2 className="md:text-2xl text-lg font-semibold ">
          {post.comments.length} Comments
        </h2>

        <div className="rounded-lg md:p-6 p-4 bg-[#0F171B]">
          <div className="flex md:space-x-[1.5rem] space-x-[1rem]">
            {session?.photo ? (
              <img
                src={session.photo}
                className="md:w-12 md:h-12 w-10 h-10 rounded-full object-cover"
                alt="Your avatar"
              />
            ) : (
              <div
                className="md:w-12 md:h-12 w-10 h-10  bg-[#131F24] rounded-full border border-white/20 flex items-center justify-center"
                style={{ aspectRatio: 1 }}
              >
                <p className="text-base leading-none">
                  {generateUsername(session?.name)}
                </p>
              </div>
            )}
            <div className="rounded-lg bg-[#131F24] w-full relative">
              <textarea
                className="resize-none w-full pr-10 rounded-lg p-3 bg-transparent text-white outline-none md:text-base text-sm"
                placeholder="Write your comment here"
                rows={2}
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
              <LuSendHorizontal
                className="absolute bottom-3 right-3 z-40 cursor-pointer text-white md:text-xl"
                title="Create"
                onClick={createComment}
              />
            </div>
          </div>
        </div>

        <div className="mt-[1rem] space-y-[2rem]">
          {post?.comments?.map((comment) => (
            <div
              className="rounded-lg md:p-6 p-4 bg-[#0F171B] "
              key={comment.id}
            >
              <div className="flex items-center justify-between ">
                <div className="flex items-center space-x-[1rem]">
                  {comment.user.photo ? (
                    <img
                      src={comment.user.photo}
                      className="md:w-12 md:h-12 w-10 h-10  rounded-full object-cover"
                      alt={`${comment.user.name}'s avatar`}
                    />
                  ) : (
                    <div className="md:w-12 md:h-12 w-10 h-10  bg-[#131F24] rounded-full object-cover border border-white/20  flex items-center justify-center">
                      {generateUsername(comment?.user?.name)}
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold">{comment.user.name}</h3>
                    <p className="opacity-80  text-sm">
                      {timeAgo(comment.created_at)}
                    </p>
                  </div>
                </div>

                {session.id === comment.user.id && (
                  <div className="relative">
                    <BsThreeDots
                      className="text-xl cursor-pointer"
                      onClick={() =>
                        setActiveOptionId(
                          activeOptionId === comment.id ? null : comment.id
                        )
                      }
                    />
                    {activeOptionId === comment.id && (
                      <div className="bg-[#212C31] absolute top-8 right-0 rounded-lg z-50 min-w-[120px] shadow-lg">
                        <div
                          className="flex items-center space-x-[1rem] hover:bg-[#0F171B]/70 px-4 py-3 cursor-pointer"
                          onClick={() => {
                            setEditCommentId(comment.id);
                            setEditedComment(comment.comment);
                            setActiveOptionId(null);
                          }}
                        >
                          <MdOutlineModeEdit className="text-xl" />
                          <p>Edit</p>
                        </div>
                        <div
                          className="flex items-center space-x-[1rem] hover:bg-[#0F171B]/70 px-4 py-3 cursor-pointer"
                          onClick={() => setIsDeleteComment(true)}
                        >
                          <AiOutlineDelete className="text-red-400 text-xl" />
                          <p>Delete</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {editCommentId === comment.id ? (
                <div className="mt-[1rem]">
                  <textarea
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                    className="w-full outline-none mt-[1rem] resize-none text-lg bg-[#131F24] p-3 rounded-lg"
                    rows={2}
                  />
                  <div className="flex justify-end items-center space-x-[1rem] mt-2">
                    <button
                      className="rounded-lg py-2 px-4 bg-gray-600 hover:bg-gray-700 cursor-pointer"
                      onClick={() => setEditCommentId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="rounded-lg py-2 px-4 bg-blue-500 hover:bg-blue-600 cursor-pointer"
                      onClick={updateComment}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-[1rem] whitespace-pre-wrap md:text-lg">
                  {comment.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {isDeleteComment && (
        <ConfirmationModal
          onClose={() => {
            setIsDeleteComment(false);
            setActiveOptionId(null);
          }}
          onConfirm={deleteComment}
          confirmBg={"bg-red-400"}
          confirmText={"Delete"}
          description={
            "Are you sure you want to delete? This action cannot be undone."
          }
        />
      )}

      {isDeletePost && (
        <ConfirmationModal
          onClose={() => {
            setIsDeletePost(false);
            setActiveOptionId(null);
          }}
          onConfirm={deletePost}
          confirmBg={"bg-red-400"}
          confirmText={"Delete"}
          description={
            "Are you sure you want to delete? This action cannot be undone."
          }
        />
      )}

      {successAlert && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ease-in-out opacity-100 animate-fade">
          <Alert text={successAlert} />
        </div>
      )}

      {errorAlert && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ease-in-out opacity-100 animate-fade">
          <ErrorAlert text={errorAlert || "An error occured!"} />
        </div>
      )}
    </div>
  );
};

export default DiscussionById;
