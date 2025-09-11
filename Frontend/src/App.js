import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import BookDetails from './pages/BookDetails';

function App() {
  return (
    <Router>
      {/* 🌟 Enhanced Navbar */}
      <nav
        className="navbar navbar-expand-lg"
        style={{
          background: 'linear-gradient(to right, #4b6cb7, #182848)', // deep blue gradient
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold text-white" to="/">📚 BookApp</Link>
          <button
            className="navbar-toggler"
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
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-white" to="/">🏠 Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-white" to="/favorites">❤️ Favorites</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-white" to="/profile">👤 Profile</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-white" to="/login">🔐 Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-white" to="/register">📝 Register</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ✅ Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/books/:id" element={<BookDetails />} />
      </Routes>
    </Router>
  );
}

export default App;