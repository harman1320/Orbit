import { Link } from "react-router-dom";
import HeroSection from "../../assets/heroSection.svg";
import HomeNavbar from "../Navbar/HomeNavbar.jsx";
import Footer from "../Footer/Footer.jsx";

import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">

    <HomeNavbar></HomeNavbar>

      <main>

        <section className="orbit-hero">
          <div className="container">

            <div className="row align-items-center justify-content-center">
              <div className="col-12 col-lg-6">

                <div className="orbit-hero-content">

                  <span className="orbit-eyebrow">
                    OPEN SOURCE • VERSION CONTROL • COLLABORATION
                  </span>

                  <h1 className="orbit-hero-title">
                    Build. Collaborate.
                    <span> Ship with Orbit.</span>
                  </h1>

                  <p className="orbit-hero-description">
                    Orbit is a developer-focused platform for managing
                    repositories, tracking code, and collaborating on
                    software projects — all in one place.
                  </p>

                  <div className="d-flex flex-column flex-sm-row gap-3">

                    <Link
                      to="/signup"
                      className="btn orbit-primary-button"
                    >
                      Get started
                    </Link>

                    <Link
                      to="/auth"
                      className="btn orbit-secondary-button"
                    >
                      Sign in
                    </Link>

                  </div>

                  <p className="orbit-hero-note">
                    A modern platform built for developers and open-source
                    communities.
                  </p>

                </div>

              </div>

              <div className="col-12 col-lg-6">

                <div className="orbit-hero-visual">

                  <div className="orbit-visual-glow"></div>

                  <div className="orbit-image-wrapper">
                    <img
                      src={HeroSection}
                      alt="Developers collaborating on code"
                      className="orbit-hero-image"
                    />
                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>

        <section className="orbit-intro-section">

          <div className="container">

            <div className="row justify-content-center">

              <div className="col-12 col-lg-8 text-center">

                <span className="orbit-section-label">
                  WHY ORBIT
                </span>

                <h2 className="orbit-section-title">
                  Your code. Your projects. Your orbit.
                </h2>

                <p className="orbit-section-description">
                  From creating repositories to exploring source code,
                  Orbit provides a simple environment where developers
                  can build and manage their projects with confidence.
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>


      <Footer></Footer>

    </div>
  );
};

export default Home;