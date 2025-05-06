import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Spinner, Modal, Button, Alert } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashUsers() {
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  console.log(users);

  const handleDeleteUser = async () => {
    const res = await fetch(`api/user/delete/${userIdToDelete}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (!res.ok) {
      console.log(data.message);
    } else {
      setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      if (users.length < 9) {
        setShowMore(false);
      }
    }
    setShowModal(false);
  };

  const handleShowMore = async () => {
    try {
      setIsLoading(true);
      const startIndex = users.length;
      const res = await fetch(`api/post/getUsers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data?.users]);
        if (data.users.length < 9) {
          setShowMore(false);
          setIsLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`api/user/getUsers`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setUsers(data.users);
          setIsLoading(false);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, []);

  return isLoading ? (
    <div className="text-center m-auto text-2xl">
      <Spinner size="lg" /> <span className="pl-3">Loading..</span>
    </div>
  ) : (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 my-5">
      {currentUser?.isAdmin && users?.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head className="text-md">
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users?.map((user) => {
              const createdAt = new Date(user?.createdAt);
              return (
                <Table.Body key={user?._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{createdAt.toLocaleDateString()}</Table.Cell>
                    <Table.Cell className="flex justify-center">
                      <img
                        className=" rounded-full w-11 h-10 object-cover bg-gray-500 "
                        src={user?.profilePicture}
                      />
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-gray-300 ">
                      {user?.username}
                    </Table.Cell>
                    <Table.Cell>{user?.email}</Table.Cell>
                    <Table.Cell className="flex justify-center items-center">
                      {user?.isAdmin ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                    </Table.Cell>
                    <Table.Cell
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setUserIdToDelete(user?._id);
                        setShowModal(true);
                      }}
                    >
                      Delete
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
          </Table>
          {showMore &&
            (isLoading ? (
              <div className="text-center">
                <Spinner size="sm" /> <span className="pl-3">Loading..</span>
              </div>
            ) : (
              <div
                className="text-center font-medium text-sm my-3 cursor-pointer hover:underline text-gray-900 dark:text-blue-200"
                onClick={handleShowMore}
              >
                Show More
              </div>
            ))}
        </>
      ) : (
        <p>No users available</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="tex-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this account ?
            </h3>
            <div className="flex justify-between">
              <Button color="failure" onClick={handleDeleteUser}>
                Delete
              </Button>
              <Button
                outline
                color="success"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
