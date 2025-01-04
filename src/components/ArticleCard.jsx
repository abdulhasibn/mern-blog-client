import { Button } from "flowbite-react";
import React from "react";

const ArticleCard = ({ article }) => {
  const { title, image, category, slug } = article;
  const [isReadButtonVisible, setIsReadButtonVisible] = React.useState(false);
  const handleReadArtcileButtonClick = () => {
    window.location.href = `/post/${slug}`;
  };
  return (
    <div
      className="max-w-sm rounded overflow-hidden shadow-lg  bg-[rgb(16,23,42)] border border-[#60ddeb] flex-1 flex flex-col justify-between cursor-pointer"
      onMouseEnter={() => setIsReadButtonVisible(true)}
      onMouseLeave={() => setIsReadButtonVisible(false)}
    >
      <img className="w-full h-48 object-contain" src={image} alt={title} />
      <div className="px-6 py-4">
        <h2 className="font-bold text-xl mb-2">{title}</h2>
        <p className="text-gray-700 text-base">{category}</p>
      </div>
      <div
        className={`w-full p-4 ${
          isReadButtonVisible ? "opacity-1" : "opacity-0"
        }`}
      >
        <Button
          outline
          onClick={handleReadArtcileButtonClick}
          className="text-[#60ddeb] w-full "
        >
          Read this article
        </Button>
      </div>
    </div>
  );
};

export default ArticleCard;
