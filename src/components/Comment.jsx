import React from "react";
import moment from "moment";
import { HiHandThumbUp } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { FaUserAlt } from "react-icons/fa";
import { getAllComments } from "./utils/getAllComments";
import EditComment from "./EditComment";

const Comment = ({
  imgUrl,
  username,
  createdAt,
  content,
  likes,
  userId,
  commentId,
  isLiked,
  setComments,
  postId,
  setEditCommentId,
  editCommentId,
}) => {
  const { currentUser } = useSelector((state) => state.user);
  const handleLikeButtonClick = async () => {
    try {
      const res = await fetch(
        `/api/comment/updateLikeForComments?userId=${currentUser?._id}&commentId=${commentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        console.log("Liked");
        getAllComments(postId, setComments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Comment Deleted");
        getAllComments(postId, setComments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = () => {
    setEditCommentId(commentId);
  };
  const handleEditOnCancel = () => {
    setEditCommentId(null);
  };

  const handleEditOnSave = async (editedComment) => {
    try {
      const res = await fetch(`/api/comment/editComment/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedComment,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Comment Updated");
        setEditCommentId(null);
        getAllComments(postId, setComments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-3 items-center border-b border-slate-300 pb-3">
      {imgUrl ? (
        <img
          src={imgUrl}
          alt="Profile Picture"
          className="w-10 h-10 rounded-full"
        />
      ) : (
        <FaUserAlt size={30} />
      )}
      <div>
        <div className="flex flex-col">
          <div className="flex gap-3">
            <div className="font-bold">@{username || "sample"}</div>
            <div>{moment(createdAt).fromNow()}</div>
          </div>
          <div>{content || "Sample text"}</div>
        </div>
        {editCommentId === commentId ? (
          <EditComment
            comment={content}
            onCancel={handleEditOnCancel}
            onSave={handleEditOnSave}
          />
        ) : (
          <div className="flex gap-2 items-center cursor-pointer">
            <HiHandThumbUp
              className="text-slate-500"
              onClick={handleLikeButtonClick}
              color={`${isLiked ? "blue" : "grey"}`}
            />
            <div className="text-slate-400">{likes} likes</div>
            {currentUser?._id === userId && (
              <div className="flex gap-2 text-blue-500">
                <p className="cursor-pointer" onClick={handleEditClick}>
                  Edit
                </p>
                <p className="cursor-pointer" onClick={handleDeleteClick}>
                  Delete
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
