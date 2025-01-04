import React from "react";
import CallToActionProject from "../components/CallToActionProject";
export default function Projects() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-bold text-center">Projects</h1>
        <p className="text-[#65666e] text-center">
          Build fun and engaging projects while learning HTML, CSS, and
          JavaScript!
        </p>
        <div>
          <CallToActionProject />
        </div>
      </div>
    </div>
  );
}
