import Navbar from "../Navbar.jsx";
import "./Dashboard.css";

import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../authContext.jsx";
import events from "../../data/events.js";

import StarBorderIcon from "@mui/icons-material/StarBorder";

const Dashboard = () => {
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const id = localStorage.getItem("id");
    const url = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    const fetchRepositories = async () => {
      try {
        const res = await axios.get(`${url}/repo/user/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        setRepositories(res.data.repositories);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const res = await axios.get(`${url}/repo/all`);

        setSuggestedRepositories(res.data);
      } catch (err) {
        console.error("Error while fetching suggested repositories: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, [currentUser]);

  // Search repositories
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <div className="dashboard min-vh-100">
      <Navbar setSearchQuery={setSearchQuery} />

      <div className="container-fluid px-4 py-4">
        <div className="row g-4 dashboard-content">

          {/* SUGGESTED REPOSITORIES */}
          <div className="col-12 col-md-3">
            <div className="dashboard-section">

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="section-title mb-0">
                  Suggested repositories
                </h6>

                <span className="text-secondary small">
                  {suggestedRepositories.length}
                </span>
              </div>

              <div className="list-group list-group-flush">
                {suggestedRepositories.map((repo) => (
                  <div
                    key={repo._id}
                    className="list-group-item github-list-item px-2"
                  >
                    <div className="d-flex align-items-center gap-2">

                      <div className="repo-icon">
                        <span>
                          {repo.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="min-width-0">
                        <Link
                          to={`/repo/${repo._id}`}
                          className="repo-link"
                        >
                          <div className="repo-name text-truncate">
                            {repo.name}
                          </div>
                        </Link>

                        <div className="repo-description text-truncate">
                          {repo.description || "No description"}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* OWNER REPOSITORIES */}
          <div className="col-12 col-md-6">
            <div className="dashboard-section">

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="section-heading mb-1">
                    Your repositories
                  </h5>

                  <p className="section-subtitle mb-0">
                    Repositories you own
                  </p>
                </div>

                <span className="badge github-badge">
                  {searchResults.length}
                </span>
              </div>

              <div className="d-flex flex-column gap-3">
                {searchResults.length > 0 ? (
                  searchResults.map((repo) => (
                    <div
                      key={repo._id}
                      className="card github-repo-card"
                    >
                      <div className="card-body p-3">

                        <div className="d-flex justify-content-between align-items-start">

                          {/* Repository information */}
                          <div className="d-flex align-items-start gap-3">

                            <div className="repo-icon repo-icon-large">
                              <span>
                                {repo.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>

                            <div className="min-width-0">
                              <Link
                                to={`/repo/${repo._id}`}
                                className="repo-link"
                              >
                                <h5 className="card-title repo-title mb-1 text-truncate">
                                  {repo.name}
                                </h5>
                              </Link>

                              <p className="card-text repo-description mb-0">
                                {repo.description ||
                                  "No description provided for this repository."}
                              </p>
                            </div>

                          </div>

                          {/* Repository action */}
                          <button
                            type="button"
                            className="repo-star-button"
                            title="Star repository"
                            aria-label={`Star ${repo.name}`}
                          >
                            <StarBorderIcon />
                          </button>

                        </div>

                        {/* Repository footer */}
                        <div className="repo-card-footer mt-3 pt-3">

                          <div className="repo-status-dots">
                            <span className="status-dot status-green"></span>
                            <span className="status-dot status-yellow"></span>
                            <span className="status-dot status-red"></span>
                          </div>

                          <span className="small text-secondary">
                            Repository
                          </span>

                          <span className="small text-secondary">
                            •
                          </span>

                          <span className="small text-secondary">
                            {repo.visibility ? "Private" : "Public"}
                          </span>

                        </div>

                      </div>
                    </div>
                  ))
                ) : (
                  <div className="card github-empty-card">
                    <div className="card-body text-center py-5">

                      <div className="empty-icon mb-3">
                        🔍
                      </div>

                      <h6 className="text-light">
                        No repositories found
                      </h6>

                      <p className="text-secondary mb-0">
                        Try searching for a different repository.
                      </p>

                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* EVENTS */}
          <div className="col-12 col-md-3">
            <div className="dashboard-section">

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="section-title mb-0">
                  Events
                </h6>

                <span className="text-secondary small">
                  Activity
                </span>
              </div>

              <div className="github-event-card p-4">

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="mb-1">
                      Latest Events
                    </h5>

                    <p className="section-subtitle mb-0">
                      Workshops and initiatives conducted by Orbit
                    </p>
                  </div>
                </div>

                <div>
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="event-item py-3 border-bottom"
                    >
                      <div className="d-flex justify-content-between align-items-start gap-3">

                        <div>
                          <Link
                            to={`/events/${event.slug}`}
                            className="event-title"
                          >
                            {event.title}
                          </Link>

                          <p className="event-description mt-2 mb-2">
                            {event.shortDescription}
                          </p>

                          <small className="event-date">
                            {event.date}
                          </small>
                        </div>

                        <Link
                          to={`/events/${event.slug}`}
                          className="event-read-more"
                        >
                          Read more
                        </Link>

                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;