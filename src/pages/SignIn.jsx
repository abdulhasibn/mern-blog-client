import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";

import OAuth from "../components/OAuth";
export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }

  async function handleSubmit(e) {
    console.log("works");
    e.preventDefault();
    try {
      dispatch(signInStart());
      const { email, password } = formData;
      if (!email || !password) {
        return dispatch(signInFailure("Please fill out all the fields"));
      }
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        data.statusCode === 403
          ? dispatch(signInFailure("Email and Password does not match "))
          : dispatch(signInFailure("User does not exist, try signing up"));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error));
    }
  }
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
                  <Spinner size="sm" /> <span className="pl-3">Loading..</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account ?</span>
            <Link to="/signUp" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert color="red" className="mt-5">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
