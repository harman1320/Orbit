import { Link } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import orbitGit from "../assets/orbitGit-logo.svg";
import profilePic from "../assets/profile.png";

import "./Navbar.css";

import { useEffect } from "react";
import Tooltip from "bootstrap/js/dist/tooltip";
import Dropdown from "bootstrap/js/dist/dropdown";

export default function Navbar({setSearchQuery, showSearchBox=true}) {
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );

  const tooltipList = [...tooltipTriggerList].map(
    (element) => new Tooltip(element)
  );

  const dropdownTriggerList = document.querySelectorAll(
    '[data-bs-toggle="dropdown"]'
  );

  const dropdownList = [...dropdownTriggerList].map(
    (element) => new Dropdown(element)
  );

  return () => {
    tooltipList.forEach((tooltip) => tooltip.dispose());
    dropdownList.forEach((dropdown) => dropdown.dispose());
  };
  }, []);

  return (
    <nav className="navbar navbar-dark orbit-navbar">
      <div className="container-fluid navbar-container">
        <div className="navbar-logo">
          <Link to="/dashboard" className="navbar-brand">
            <img src={orbitGit} alt="OrbitGit Logo" className="logo" />

            <span className="fs-6">Dashboard</span>
          </Link>
        </div>

        {showSearchBox && <div className="navbar-search">
          <div className="input-group">
            <span className="input-group-text search-icon">
              <SearchIcon />
            </span>

            <input
              type="text"
              className="form-control search-input"
              placeholder="Search Your Repositories"
              aria-label="Search repositories"
              onChange={(e) => setSearchQuery?.(e.target.value)}
            />
          </div>
        </div>}

        <div className="navbar-right">
          {/* Create Repository */}
          <div className="navbar-create-repo">
            <Link
              to="/repo/create"
              className="navbar-icon"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              data-bs-title="Create a new Repository"
            >
              <AddIcon />
            </Link>
          </div>

          <div className="navbar-profile dropdown">
            <button
              className="profile-button"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img src={profilePic} alt="Profile" className="profile-pic" />
            </button>

            <ul className="dropdown-menu dropdown-menu-end profile-dropdown">
              <li>
                <div className="profile-header">
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="dropdown-profile-pic"
                  />

                  <div>
                    <strong>harman1320</strong>
                    <div className="profile-name">Harmanjit Singh</div>
                  </div>
                </div>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <Link to="/profile" className="dropdown-item">
                  Profile
                </Link>
              </li>

              <li>
                <Link to="/profile/update" className="dropdown-item">
                  Update Profile
                </Link>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <button className="dropdown-item">Sign out</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}