import orbitLogo from "../../assets/orbitGit-logo.svg";
import HomeNavbar from "../Navbar/HomeNavbar.jsx";
import Footer from "../Footer/Footer.jsx";
import "./auth.css";

import { useAuth } from "../../authContext.jsx";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("");

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      return;
    }

    try {
      setLoading(true);

      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${API_URL}/signup`, {
        username: username,
        email: email,
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.id);

      setCurrentUser(res.data.id);
      setLoading(false);

      toast.success(`Welcome ${res.data.name}`);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      console.error("Error occurred : ", err.message);
      toast.error(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="auth-page">
      <HomeNavbar></HomeNavbar>

      <div className="container my-md-5 login-container">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <img src={orbitLogo} alt="Logo" className="login-page-logo mb-3" />

          <h6 className="fs-6">Sign up for Orbit</h6>
        </div>
      </div>

      <form
        className="row g-3 needs-validation justify-content-center mt-4"
        noValidate
        onSubmit={handleSignup}
        method="post"
      >
        <div className="col-md-6 mx-2 mt-4">
          <label htmlFor="validationCustom01" className="form-label">
            Username
          </label>

          <input
            type="text"
            className="form-control"
            id="validationCustom01"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <div className="invalid-feedback">Please provide username</div>
        </div>
        <div className="col-md-6 mx-2 mt-4">
          <label htmlFor="validationCustom01" className="form-label">
            Email
          </label>

          <input
            type="email"
            className="form-control"
            id="validationCustom02"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="invalid-feedback">Please provide email</div>
        </div>

        <div className="col-md-6 mx-2 mt-4">
          <label htmlFor="validationCustom02" className="form-label">
            Password
          </label>

          <input
            type="password"
            className="form-control"
            id="validationCustom03"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="invalid-feedback">Please provide password</div>
        </div>

        <div className="d-grid gap-2 col-md-6 mx-auto">
          <button
            className="btn btn-success mt-4"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign up"}
          </button>
        </div>
      </form>

      <div className="row justify-content-center text-center mt-5">
        <p className="login-signup-div">
          Already have an account? <Link to="/auth">Sign in</Link>
        </p>
      </div>
    </div>

    <Footer></Footer>
    </div>
  );
};

export default Signup;
