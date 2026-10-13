import { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import {toast} from "react-toastify";

import Home from "./components/Home/Home.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import Signup from "./components/auth/Signup.jsx";
import Login from "./components/auth/Login.jsx";
import Profile from "./components/user/Profile.jsx";
import UserRepo from "./components/repo/UserRepo.jsx";
import RepoDetails from "./components/repo/RepoDetails.jsx";
import EventDetails from "./components/EventDetails/EventDetails.jsx";

// Auth Context
import { useAuth } from "./authContext.jsx";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let userId = localStorage.getItem("id");

    if (userId && !currentUser) {
      setCurrentUser(userId);
    }

    if (!userId && !["/auth", "/signup"].includes(window.location.pathname)) {
      navigate("/");
    }

    if (userId && window.location.pathname == "/auth") {
      toast.success(`You are logged in!`);
      navigate("/dashboard");
    }
  }, [currentUser, setCurrentUser, navigate]);

  let element = useRoutes([
    {
      path: "/",
      element: <Home></Home>
    }, 
    {
      path: "/dashboard",
      element: <Dashboard></Dashboard>,
    },
    {
      path: "/signup",
      element: <Signup></Signup>,
    },
    {
      path: "/auth",
      element: <Login></Login>,
    },
    {
      path: "/profile",
      element: <Profile></Profile>,
    },
    {
      path: "/repos",
      element: <UserRepo></UserRepo>,
    },
    {
      path: "/repo/:id",
      element: <RepoDetails></RepoDetails>,
    },
    {
      path: "/events/:slug",
      element: <EventDetails></EventDetails>
    }
  ]);

  return element;
};

export default ProjectRoutes;
