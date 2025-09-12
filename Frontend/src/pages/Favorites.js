import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await axiosInstance.get('/api/users/profile');
        setFavorites(res.data.favorites || []);
      } catch (err) {
        console.error('Failed to load favorites:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  const removeFavorite = async (bookId) => {
    try {
      await axiosInstance.delete(`/api/users/favorites/${bookId}`);
      setFavorites(favorites.filter((book) => book._id !== bookId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  const viewDetails = (bookId) => {
    navigate(`/book-details/${bookId}`);
  };

  if (!token) {
    return (
      <div className="favorites-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="empty-state">
                <div className="empty-state-icon">
                  <i className="bi bi-heart-fill"></i>
                </div>
                <h2>Your Favorite Books Await!</h2>
                <p>
                  Log in to save and manage your favorite books in one place.
                </p>
                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                  <Link to="/login" className="btn btn-primary btn-lg px-4 me-sm-3">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-outline-primary btn-lg px-4">
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="favorites-container d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3.5rem', height: '3.5rem', borderWidth: '0.3em' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3 className="mt-4 text-primary">Loading Your Favorites</h3>
          <p className="text-muted">We're getting your saved books ready</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h1 className="display-5 fw-bold mb-2" style={{ color: '#1a365d' }}>Your Favorites</h1>
            <p className="text-muted mb-0">
              <i className="bi bi-heart-fill text-danger me-1"></i> 
              {favorites.length} {favorites.length === 1 ? 'saved book' : 'saved books'}
            </p>
          </div>
          <div className="d-flex align-items-center">
            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 ms-2">
              <i className="bi bi-collection me-1"></i> Collection
            </span>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="bi bi-heart"></i>
            </div>
            <h4 className="mb-3">No favorites yet</h4>
            <p className="text-muted mb-4">Start exploring books and add your favorites to see them here!</p>
            <Link to="/books" className="btn btn-primary px-4">
              <i className="bi bi-book me-2"></i>Browse Books
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {favorites.map((book) => (
              <div key={book._id} className="col-md-6 col-lg-4">
                <div className="favorite-card">
                  <div className="position-relative">
                    {book.coverImage && (
                      <img 
                        src={book.coverImage} 
                        alt={book.title}
                        className="card-img-top"
                      />
                    )}
                    <button 
                      className="remove-btn"
                      onClick={(e) => removeFavorite(book._id, e)}
                      title="Remove from favorites"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-2" style={{ color: '#2d3748' }}>{book.title}</h5>
                    <p className="text-muted mb-3">
                      <i className="bi bi-person me-1"></i> 
                      {book.author || 'Unknown Author'}
                    </p>
                    {book.rating && (
                      <div className="d-flex align-items-center mb-3">
                        <div className="rating-stars" style={{ fontSize: '1.1rem' }}>
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`bi ${i < Math.floor(book.rating) ? 'bi-star-fill' : 'bi-star'}`}
                            ></i>
                          ))}
                        </div>
                        <small className="ms-2" style={{ color: '#4a5568' }}>
                          <strong>{book.rating.toFixed(1)}</strong> 
                          <span className="text-muted">({book.reviewCount || 0} reviews)</span>
                        </small>
                      </div>
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="genre-badge">
                        {book.genre || 'Fiction'}
                      </span>
                      <button 
                        className="btn btn-sm btn-primary px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          viewDetails(book._id);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #4a90e2 0%, #5e72e4 100%)',
                          border: 'none',
                          fontWeight: 500,
                          letterSpacing: '0.5px',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 10px rgba(74, 144, 226, 0.3)'
                        }}
                      >
                        <i className="bi bi-eye me-1"></i> View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;