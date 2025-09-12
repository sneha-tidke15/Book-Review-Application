import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/api/users/profile');
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!token) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm border-0 text-center p-5">
              <div className="mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="64" 
                  height="64" 
                  fill="#198754" 
                  className="bi bi-person-circle" 
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                  <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                </svg>
              </div>
              <h3 className="mb-3">Your Profile Awaits!</h3>
              <p className="text-muted mb-4">
                Log in to view and manage your profile, see your favorite books, and track your reading journey.
              </p>
              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <Link to="/login" className="btn btn-success btn-lg px-4 me-sm-3">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-outline-secondary btn-lg px-4">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your profile...</p>
      </div>
    );
  }

  // If user data is not available yet, show loading
  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow border-0 rounded-3 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-success bg-opacity-10 p-4 text-center">
              <div className="mx-auto mb-3" style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: '#198754',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: 'bold'
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h2 className="text-success mb-1">{user?.name || 'User'}</h2>
              <p className="text-muted">{user?.email || 'No email provided'}</p>
            </div>
            
            {/* Favorites Section */}
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-success mb-0">
                  <i className="bi bi-bookmark-heart me-2"></i>
                  Your Favorites
                </h4>
                <span className="badge bg-success rounded-pill">
                  {user?.favorites?.length || 0} {user?.favorites?.length === 1 ? 'book' : 'books'}
                </span>
              </div>
              
              {!user.favorites || user.favorites.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="48" 
                      height="48" 
                      fill="#dee2e6" 
                      className="bi bi-bookmark" 
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                    </svg>
                  </div>
                  <h5 className="text-muted">No favorites yet</h5>
                  <p className="text-muted mb-0">Start exploring and add your favorite books here!</p>
                  <Link to="/" className="btn btn-outline-success mt-3">
                    <i className="bi bi-house-door me-2"></i>
                    Browse Books
                  </Link>
                </div>
              ) : (
                <div className="row g-3">
                  {user.favorites.map((book) => (
                    <div key={book._id} className="col-md-6">
                      <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                        <div className="card-body">
                          <h5 className="card-title text-truncate">{book.title}</h5>
                          <p className="card-text text-muted">by {book.author}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => navigate(`/books/${book._id}`)}
                            >
                              <i className="bi bi-eye me-1"></i> View
                            </button>
                            <small className="text-muted">
                              Added on {new Date(book.addedAt).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer with Logout */}
            <div className="border-top p-3 bg-light text-end">
              <button 
                className="btn btn-outline-danger"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;