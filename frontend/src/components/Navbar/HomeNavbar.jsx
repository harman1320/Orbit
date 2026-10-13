import {Link} from "react-router-dom";
import orbitGit from "../../assets/orbitGit-logo.svg";

import "./HomeNavbar.css";

const HomeNavbar = () => {
return <nav className="navbar navbar-expand-lg orbit-home-navbar">
        <div className="container-fluid px-4 px-lg-5">

          <Link
            to="/"
            className="navbar-brand orbit-home-brand"
          >
            <img
              src={orbitGit}
              alt="Orbit logo"
              className="orbit-home-logo"
            />

            <span>Orbit</span>
          </Link>

          <button
            className="navbar-toggler orbit-navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#orbitHomeNavbar"
            aria-controls="orbitHomeNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="orbitHomeNavbar"
          >
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">

              <Link
                to="/auth"
                className="nav-link orbit-nav-link"
              >
                Sign in
              </Link>

              <Link
                to="/signup"
                className="btn orbit-signup-button ms-lg-2"
              >
                Sign up
              </Link>

            </div>
          </div>

        </div>
      </nav>
} 

export default HomeNavbar;