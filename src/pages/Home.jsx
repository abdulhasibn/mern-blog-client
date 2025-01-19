import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ArticleCard from "../components/ArticleCard";
import { getBackendUrl } from "../utils/getBackendUrl";
import CallToActionProject from "../components/CallToActionProject";

export default function Home() {
  const [recentArticles, setRecentArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchRecentArticles = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${getBackendUrl()}/api/post/getPosts?limit=10`
        );
        const data = await res.json();

        if (!res.ok) {
          setPostError(data.message);
          setIsLoading(false);
        } else {
          setRecentArticles(data.posts);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    fetchRecentArticles();
  }, []);
  return (
    <div>
      <div className=" w-1/2 mx-auto my-8 p-5 flex flex-col ">
        <h1 className="text-[4vw] font-bold">Welcome to my Blog</h1>
        <p className="text-sm">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
      </div>

      <CallToActionProject />

      <div className="w-1/2 m-auto grid grid-cols-2 gap-8 my-20">
        {recentArticles?.map((article) => {
          return <ArticleCard key={article._id} article={article} />;
        })}
      </div>
    </div>
  );
}
