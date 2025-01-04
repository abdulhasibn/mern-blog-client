import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import OAuth from "../components/OAuth";
import { useDispatch } from "react-redux";
export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }
  const dispatch = useDispatch();
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage(null);
      const { username, email, password } = formData;
      if (!username || !email || !password) {
        setLoading(false);
        return setErrorMessage("All fields are required");
      }
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (
        (data.success === false) &
        (data.errorCode && data.errorCode === 11000)
      ) {
        setErrorMessage(
          "Duplicate entry! User with same username or Email already exists"
        );
      }
      setLoading(false);
      if (!res.ok) {
        setErrorMessage(data.message);
      } else {
        navigate("/signIn");
      }
      console.log(data);
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  useEffect(() => {}, []);
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link
            to="/"
            className="self-center whitespace-nowrap font-semibold dark:text-white text-4xl"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Vector
            </span>{" "}
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a project done to get familiarized with developing apps in
            MERN stack
          </p>
        </div>
        {/*right*/}
        <div className="flex-1">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="">
              <Label value="Username" />
              <TextInput
                type="text"
                placeholder="eg: Abdul Hasib"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="eg: abdulhasib@example.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="password"
                id="password"
                onChange={handleChange}
              />
            </div>

            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div>
                  <Spinner size="sm" /> <span className="pl-3">Loading..</span>{" "}
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account already ?</span>
            <Link to="/signIn" className="text-blue-500">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert color="red" className="my-4">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
