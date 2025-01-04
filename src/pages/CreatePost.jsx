import React, { useState, useEffect } from "react";
import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

  const handleFormInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);

      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image could not be uploaded");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadableUrl) => {
            setFormData({ ...formData, image: downloadableUrl });
            setImageUploadProgress(null);
          });
        }
      );
    } catch (error) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`api/post/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError(error.message);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h3 className="text-3xl font-semibold text-center my-7">Create Post</h3>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <TextInput
            type="text"
            id="title"
            className="flex-1"
            required
            placeholder="Title"
            onChange={handleFormInputChange}
          />
          <Select
            type="select"
            id="category"
            required
            placeholder="Title"
            onChange={handleFormInputChange}
          >
            <option value="uncategorized">Select your category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React JS</option>
            <option value="nextjs">Next JS</option>
          </Select>
        </div>
        <div className="border-4 border-dotted border-teal-500 p-3 flex justify-between">
          <FileInput
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        {imageUploadError && (
          <Alert color={"failure"}>{imageUploadError}</Alert>
        )}
        <ReactQuill
          className="h-72 mb-12"
          theme="snow"
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button type="submit" gradientDuoTone={"purpleToPink"}>
          Publish
        </Button>
        {publishError && <Alert color={"failure"}>{publishError}</Alert>}
      </form>
    </div>
  );
}
