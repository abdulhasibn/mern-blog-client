import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowRight,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../redux/user/userSlice";
import { signOut } from "./utils/signOut";
export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const { currentUser } = useSelector((state) => state.user);
  return (
    <div>
      <Sidebar className="w-full md:w-56 bg-red-500">
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col gap-2">
            <Link to={"/dashboard?tab=profile"}>
              <Sidebar.Item
                active={tab === "profile"}
                icon={HiUser}
                label={currentUser.isAdmin ? "Admin" : "User"}
                labelColor="dark"
                as="div"
              >
                Profile
              </Sidebar.Item>
            </Link>
            {currentUser.isAdmin && (
              <>
                <Link to={"/dashboard?tab=posts"}>
                  <Sidebar.Item
                    icon={HiDocumentText}
                    labelColor="dark"
                    as="div"
                  >
                    Posts
                  </Sidebar.Item>
                </Link>
                <Link to={"/dashboard?tab=users"}>
                  <Sidebar.Item
                    icon={HiOutlineUserGroup}
                    labelColor="dark"
                    as="div"
                  >
                    Users
                  </Sidebar.Item>
                </Link>
              </>
            )}
            <Link to={"/signIn"}>
              <Sidebar.Item
                icon={HiArrowRight}
                labelColor="dark"
                as="div"
                onClick={() =>
                  signOut(
                    dispatch,
                    signOutStart,
                    signOutFailure,
                    signOutSuccess
                  )
                }
              >
                Sign Out
              </Sidebar.Item>
            </Link>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
