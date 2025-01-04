import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Textarea } from "flowbite-react";
import { useSelector } from "react-redux";
import Comment from "./Comment";
import { getAllComments } from "./utils/getAllComments.js";
import EditComment from "./EditComment.jsx";

export default function CommentBox({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [editCommentId, setEditCommentId] = useState(null);
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    const res = await fetch("/api/comment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: comment,
        postId,
        userId: currentUser._id,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setComment(" ");
      getAllComments(postId, setComments);
    }
  };

  useEffect(() => {
    getAllComments(postId, setComments);
  }, []);
  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      {currentUser ? (
        <div className="flex gap-2 max-w-3xl w-full text-sm">
          Signed in as :
          <span>
            <img
              src={currentUser?.profilePicture}
              className="w-7 h-7 rounded-full"
            />
          </span>
          <Link to="/dashboard?tab=profile" className="text-teal-600">
            @{currentUser?.username}
          </Link>
        </div>
      ) : (
        <div>
          You must sign in to comment.
          <Link to={"/signIn"} className="text-teal-500 hover:underline ml-2">
            Sign In
          </Link>
        </div>
      )}

      <div className="border mt-3 rounded-lg border-gray-400 p-5 ">
        {currentUser && (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Textarea
              name="comment"
              id="comment"
              className="w-full bg-gray-100 text-sm rounded-md border border-gray-400 font-serif"
              placeholder="Add a comment..."
              onChange={handleCommentChange}
              value={comment}
            ></Textarea>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {200 - comment.length} characters remaining
              </span>
              <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
                Submit
              </Button>
            </div>
          </form>
        )}
      </div>
      <div className="mt-5 flex flex-col gap-2">
        {comments?.map((item, id) => {
          return (
            <>
              <Comment
                key={item._id}
                commentId={item._id}
                userId={item.userId}
                content={item.content}
                createdAt={item.createdAt}
                likes={item.numberOfLikes}
                imgUrl={item.imgUrl}
                username={item.username}
                isLiked={item.isLiked}
                setComments={setComments}
                postId={postId}
                setEditCommentId={setEditCommentId}
                editCommentId={editCommentId}
              />
            </>
          );
        })}
      </div>
    </div>
  );
}
