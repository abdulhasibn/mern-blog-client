//Package imports

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextInput, Button, Alert, Modal, Spinner } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate, Link } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

//File imports from the app

import {
  updateStart,
  updateFailure,
  updateSuccess,
  deleteFailure,
  deleteStart,
  deleteSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../redux/user/userSlice";
import { signOut } from "./utils/signOut";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);

  // States related to image file uploading

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const filePickerRef = useRef();

  // States related to updating the user function

  const [updateUserError, setUpdateUserError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);

  //Form data
  const [formData, setFormData] = useState({});

  const [showModal, setShowModal] = useState(false);

  //States from the User slice
  const { error, loading } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Function to handle the image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      //Creates a local file url which will be used to display the pro pic
      // in the page temporarily as a value for src attribute in the img tag
    }
  };

  //Function to delete the user

  const handleDeleteUser = async () => {
    dispatch(deleteStart());
    try {
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        dispatch(deleteFailure(data.message));
      } else {
        dispatch(deleteSuccess());
      }
      setShowModal(false);
      navigate("/signIn");
    } catch (error) {
      console.log(error);
      dispatch(deleteFailure(error.message));
    }
  };

  //-------------------------

  const handleFormDataChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  //-------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    //Checks if there are any changes being made to the existing user data
    if (Object.entries(formData).length < 1) {
      setUpdateUserError("No changes made");
      return;
    }

    //If the image is still uploading , this stops the user from submitting the file
    if (imageFileUploading) {
      setUpdateUserError("Please wait for the image to be uploaded");
      return;
    }

    try {
      dispatch(updateStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Profile Updated Successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  function uploadFile() {
    setImageFileUploading(true);
    setImageFileUploadError(null);

    const storage = getStorage(app); //locates the storage of our firebase app
    const fileName = new Date().getTime() + imageFile.name; //adding the current time to the file name to make it unique
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    //When the image file is uploading, we need display the circular progress bar around the image
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File size might be more than 2 mb)"
        );
        setImageFile(null);
        setImageFileUploadingProgress(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadableUrl) => {
          setImageFileUrl(downloadableUrl);
          setImageFileUploading(false);
          setImageFileUploadingProgress(null);
          setFormData({ ...formData, profilePicture: downloadableUrl });
        });
      }
    );
  }

  useEffect(() => {
    if (imageFile) {
      uploadFile();
    }
  }, [imageFile]);

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-3xl my-7 text-center">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div className="w-32 h-32 relative rounded-full self-center shadow-md overflow-hidden border">
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress}
              text={`${imageFileUploadingProgress}% `}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199, ${
                    imageFileUploadingProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser?.profilePicture}
            alt="Profile Picture"
            className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover cursor-pointer ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              "opacity-60"
            }`}
            onClick={() => filePickerRef.current.click()}
          />
        </div>
        {imageFileUploadError && (
          <Alert color={"failure"}>{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser?.username}
          onChange={handleFormDataChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser?.email}
          onChange={handleFormDataChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleFormDataChange}
        />

        <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading}>
          {loading ? (
            <div>
              <Spinner size="sm" /> <span className="pl-3">Loading..</span>
            </div>
          ) : (
            "Update"
          )}
        </Button>
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button gradientDuoTone="purpleToBlue" className="w-full">
              Create Post
            </Button>
          </Link>
        )}
        <div className="flex justify-between">
          <span
            className="text-red-500 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            Delete Account
          </span>
          <span
            className="text-red-500 cursor-pointer"
            onClick={() =>
              signOut(dispatch, signOutStart, signOutFailure, signOutSuccess)
            }
          >
            Sign Out
          </span>
        </div>
        {updateUserSuccess && (
          <Alert color={"success"}>{updateUserSuccess}</Alert>
        )}
        {updateUserError && <Alert color={"failure"}>{updateUserError}</Alert>}
        {error && <Alert color={"failure"}>{error}</Alert>}

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
      </form>
    </div>
  );
}
