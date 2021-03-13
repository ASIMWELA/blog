import React, { useRef, useEffect } from "react";
import { BiCodeAlt } from "react-icons/bi";
import { FaUserLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./navbar.css";
import { headerTextIntro } from "../../animations/Animate";

export default function NavBar() {
  let headerLinks = useRef(null);

  useEffect(() => {
    headerTextIntro(headerLinks);
  }, []);
  return (
    <div className="wave-container">
      <nav className="navbar navbar-expand-lg navbar-secondary bg-secondary justify-content-end">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <BiCodeAlt size={50} style={{ color: "white" }} />
          </Link>
          <button
            className="navbar-toggler custom-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto" ref={(el) => (headerLinks = el)}>
              <li className="nav-item">
                <Link to="/" className="nav-link active">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/projects" className="nav-link">
                  Projects
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  <FaUserLock
                    size={20}
                    style={{ color: "white", marginBottom: "35%" }}
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#8E24AA"
          fillOpacity="1"
          d="M0,0L60,21.3C120,43,240,85,360,106.7C480,128,600,128,720,112C840,96,960,64,1080,69.3C1200,75,1320,117,1380,138.7L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
        ></path>
      </svg>
    </div>
  );
}
