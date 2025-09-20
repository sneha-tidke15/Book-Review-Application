import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/favorites", label: "Favorites", protected: true },
    { path: "/profile", label: "Profile", protected: true },
  ];

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top py-2"
      style={{
        background: "#000000",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
        padding: "0.5rem 0",
        zIndex: 1000,
      }}
    >
      <div className="container">
        <Link
          className="navbar-brand fw-bold"
          to="/"
          style={{
            fontSize: "1.8rem",
            color: "#ffffff",
            fontWeight: "700",
            letterSpacing: "-0.5px",
            textDecoration: "none",
            position: "relative",
          }}
        >
          <span style={{
            color: "#4a90e2",
            fontSize: "1.5rem",
            verticalAlign: "middle"
          }}>📚</span>
          <span style={{
            color: "#4a90e2",
            fontWeight: "800"
          }}>Book</span><span style={{ color: '#ffffff' }}>Review</span>
          <span style={{
            position: "absolute",
            bottom: "-2px",
            left: "0",
            width: "100%",
            height: "2px",
            background: "#4a90e2",
            transform: "scaleX(0)",
            transition: "transform 0.3s ease"
          }} className="nav-underline"></span>
        </Link>

        {/* Toggle (Mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{
            border: "none",
            boxShadow: "none",
            padding: "0.5rem",
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            {navItems.map((item) => {
              if (item.protected && !isLoggedIn) return null;
              return (
                <li key={item.path} className="nav-item mx-2">
                  <Link
                    className={`nav-link px-4 py-2 ${
                      location.pathname === item.path
                        ? "text-white fw-bold"
                        : "text-light"
                    }`}
                    to={item.path}
                    style={{
                      fontWeight: "500",
                      borderRadius: "4px",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      padding: "0.5rem 1rem",
                      margin: "0 0.2rem",
                      position: "relative",
                      overflow: "hidden"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.color = "#ffffff";
                      e.target.style.background = "rgba(255, 255, 255, 0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = location.pathname === item.path ? "#ffffff" : "rgba(255, 255, 255, 0.9)";
                      e.target.style.background = location.pathname === item.path ? 'rgba(255, 255, 255, 0.15)' : 'transparent';
                    }}
                  >
                    {item.label}
                    {location.pathname === item.path && (
                      <span style={{
                        position: "absolute",
                        bottom: "0",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "60%",
                        height: "2px",
                        background: "#4a90e2",
                        borderRadius: "2px"
                      }}></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Auth Buttons */}
          <div className="d-flex align-items-center">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  borderRadius: '4px',
                  padding: '0.5rem 1.2rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  marginLeft: '0.5rem'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link 
                  to="/login"
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    textDecoration: 'none',
                    padding: '0.5rem 1.2rem',
                    marginRight: '0.75rem',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease',
                    fontWeight: '500'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#fff';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                    e.target.style.background = 'transparent';
                  }}
                >
                  Log In
                </Link>
                <Link 
                  to="/register"
                  style={{
                    background: '#4a90e2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.5rem 1.5rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 10px rgba(74, 144, 226, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#3a7bc8';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(74, 144, 226, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#4a90e2';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 10px rgba(74, 144, 226, 0.3)';
                  }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
