import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter className="text-3xl font-bold underline">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/post/:postSlug" element={<PostPage />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
