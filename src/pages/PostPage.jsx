import React, { useState, useEffect } from "react";
import { Spinner, Button } from "flowbite-react";
import { useParams, Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentBox from "../components/CommentBox";
import { useSelector } from "react-redux";
import ArticleCard from "../components/ArticleCard";

export default function PostPage() {
  const [post, setPost] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [postError, setPostError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { postSlug } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${getBackendUrl()}/api/post/getPosts?slug=${postSlug}`
        );
        const data = await res.json();
        if (!res.ok) {
          setPostError(data.message);
          setIsLoading(false);
        } else {
          setPost(data.posts[0]);
          console.log(data.posts[0]);
          setIsLoading(false);
        }
      } catch (error) {
        setPostError(error.message);
        setIsLoading(false);
      }
    };
    fetchPost();
  }, []);

  useEffect(() => {
    const fetchRecentArticles = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${getBackendUrl()}/api/post/getPosts?limit=3`);
        const data = await res.json();
        if (!res.ok) {
          setPostError(data.message);
          setIsLoading(false);
        } else {
          setRecentArticles(data.posts);
          setIsLoading(false);
        }
      } catch (error) {
        setPostError(error.message);
        setIsLoading(false);
      }
    };
    fetchRecentArticles();
  }, []);

  return isLoading ? (
    <div className="text-center m-auto text-2xl">
      <Spinner size="lg" /> <span className="pl-3">Loading..</span>
    </div>
  ) : (
    post && (
      <main className="max-w-6xl min-h-screen flex flex-col mx-auto p-3">
        <h1 className="text-center mt-16 text-3xl max-w-2xl mx-auto font-serif sm:text-4xl">
          {post.title}
        </h1>
        <Link
          to={`/search?category=${post.category}`}
          className="self-center mt-5"
        >
          <Button color="gray" pill size="xs">
            {post.category}
          </Button>
        </Link>
        <img
          src={post.image}
          alt={post && post.title}
          className="mt-10 p-3 max-h-[600px] w-full object-cover"
        />
        <div className="w-full flex justify-between">
          <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
          <span>{(post.content.length / 1000).toFixed(0)} min read</span>
        </div>

        <div
          className="p-3 max-w-2xl mx-auto w-full post-content mt-5 text-justify"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
        <CallToAction />

        <CommentBox postId={post?._id} />

        <div className="flex justify-between gap-5 my-16">
          {recentArticles &&
            recentArticles?.map((item) => {
              return <ArticleCard article={item} />;
            })}
        </div>
      </main>
    )
  );
}
