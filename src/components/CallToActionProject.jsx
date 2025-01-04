import React from "react";
import { Button } from "flowbite-react";

export default function CallToActionProject() {
  return (
    <div className="flex flex-col sm:flex-row  gap-6 max-w-4xl mx-auto border-2 border-teal-600  p-5 rounded-tl-3xl rounded-br-3xl justify-center items-center">
      <div className="flex flex-col gap-4 flex-1">
        <h1 className="text-2xl text-center ">
          Want to learn HTML, CSS and JavaScript by building fun and engaging
          projects?
        </h1>
        <p className=" text-gray-400">
          Checkout these projects done using HTML, CSS and Javascript
        </p>
        <Button
          gradientDuoTone={"purpleToPink"}
          className="rounded-tl-2xl rounded-br-none w-full mt-3"
        >
          <a href="https://abdulhasibn.github.io/Port-Folio/" target="_blank">
            Frontend Projects
          </a>
        </Button>
      </div>
      <div className="p-5 flex-1 w-[200px]">
        <img src="https://miro.medium.com/v2/resize:fit:1200/1*LyZcwuLWv2FArOumCxobpA.png" />
      </div>
    </div>
  );
}
