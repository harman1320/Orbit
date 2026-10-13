import orbitGit from "../../assets/orbitGit-logo.svg";
import {Link} from "react-router-dom";

import "./Footer.css";

const Footer = () => {
    return <footer className="orbit-footer">

        <div className="container">

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">

            <div className="d-flex align-items-center gap-2">

              <img
                src={orbitGit}
                alt="Orbit"
                className="orbit-footer-logo"
              />

              <span className="orbit-footer-brand">
                Orbit
              </span>

            </div>

            <p className="orbit-footer-text mb-0">
              Built for developers. Made for collaboration.
            </p>

            <div className="orbit-footer-links">
              <Link to="/" className="orbit-footer-link">
                Home
              </Link>

              <Link to="/auth" className="orbit-footer-link">
                Sign in
              </Link>

              <Link to="/signup" className="orbit-footer-link">
                Sign up
              </Link>
            </div>

          </div>

          <div className="orbit-footer-bottom">
            © {new Date().getFullYear()} Orbit. All rights reserved.
          </div>

        </div>

      </footer>
}

export default Footer;