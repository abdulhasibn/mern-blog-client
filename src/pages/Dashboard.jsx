import React, { useEffect, useState } from "react";
import DashProfile from "../components/DashProfile";
import DashSidebar from "../components/DashSidebar";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56 ">
        <DashSidebar />
      </div>
      {tab === "profile" ? <DashProfile /> : null}
      {tab === "posts" ? <DashPosts /> : null}
      {tab === "users" ? <DashUsers /> : null}
    </div>
  );
}
