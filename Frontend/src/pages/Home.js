import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axiosInstance
      .get(`/api/books?keyword=${keyword}&pageNumber=${page}`)
      .then((res) => {
        console.log('📦 API Response:', res); // Debug log
        if (res.data && Array.isArray(res.data.books)) {
          setBooks(res.data.books);
          setPages(res.data.pages || 1);
        } else {
          console.warn('⚠️ Unexpected response format:', res.data);
          setBooks([]);
        }
      })
      .catch((err) => {
        console.error('❌ Error fetching books:', err);
        setBooks([]);
      });
  }, [keyword, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const [animatingFavorites, setAnimatingFavorites] = useState({});

  const addToFavorites = async (bookId) => {
    if (!token) {
      alert('Please log in to add favorites.');
      navigate('/login');
      return;
    }

    try {
      // Start animation
      setAnimatingFavorites(prev => ({ ...prev, [bookId]: true }));
      
      await axiosInstance.post(
        '/api/users/favorites',
        { bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Show success message with a nice animation
      const successMessage = document.createElement('div');
      successMessage.textContent = '✓ Added to favorites!';
      successMessage.style.position = 'fixed';
      successMessage.style.bottom = '20px';
      successMessage.style.right = '20px';
      successMessage.style.backgroundColor = '#4CAF50';
      successMessage.style.color = 'white';
      successMessage.style.padding = '12px 24px';
      successMessage.style.borderRadius = '4px';
      successMessage.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      successMessage.style.zIndex = '1000';
      successMessage.style.animation = 'slideIn 0.3s ease-out';
      
      // Add animation keyframes
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(successMessage);
      
      // Remove message after animation
      setTimeout(() => {
        successMessage.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
          document.body.removeChild(successMessage);
          document.head.removeChild(style);
        }, 300);
      }, 2000);
      
    } catch (err) {
      console.error('❌ Failed to add favorite:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        console.error('Error response data:', err.response.data);
        console.error('Error status:', err.response.status);
        console.error('Error headers:', err.response.headers);
        alert(`Failed to add favorite: ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        alert('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', err.message);
        alert('Error setting up request: ' + err.message);
      }
    } finally {
      // Reset animation
      setTimeout(() => {
        setAnimatingFavorites(prev => ({ ...prev, [bookId]: false }));
      }, 1000);
    }
  };

  const viewDetails = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <div className="container py-4">
      {/* Hero Section with Search */}
      <div className="text-center mb-5 py-5 px-3" style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: '15px',
        marginTop: '-1rem',
        marginBottom: '2rem',
        padding: '3rem 1rem'
      }}>
        <h1 className="display-5 fw-bold mb-4">Discover Your Next Favorite Book</h1>
        <p className="lead mb-4">Explore our collection of amazing books and find your next adventure</p>
        
        <form onSubmit={handleSearch} className="mx-auto" style={{ maxWidth: '600px' }}>
          <div className="input-group input-group-lg shadow-sm">
            <input
              type="text"
              className="form-control border-0 py-3"
              placeholder="Search by title, author, or genre..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                borderRadius: '50px 0 0 50px',
                border: 'none',
                boxShadow: 'none'
              }}
            />
            <button 
              className="btn btn-primary px-4" 
              type="submit"
              style={{
                borderRadius: '0 50px 50px 0',
                padding: '0.7rem 1.5rem',
                fontWeight: '600',
                background: 'linear-gradient(45deg, #4b6cb7, #182848)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(27, 85, 226, 0.2)'
              }}
            >
              <i className="bi bi-search me-2"></i>Search
            </button>
          </div>
        </form>
      </div>

      {/* Book Grid */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
        <AnimatePresence>
          {books.map((book, index) => (
            <motion.div 
              key={book._id} 
              className="col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="card h-100 border-0 shadow-sm hover-shadow transition-all"
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}
              >
                <div style={{
                  height: '200px',
                  background: `linear-gradient(45deg, ${getRandomGradient()})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {book.title.charAt(0).toUpperCase()}
                </div>
                <div className="card-body">
                  <h5 className="card-title text-truncate">{book.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
                  <p className="card-text text-muted small" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '60px'
                  }}>
                    {book.description || 'No description available.'}
                  </p>
                </div>
                <div className="card-footer bg-transparent border-0 pt-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/books/${book._id}`)}
                      style={{
                        borderRadius: '20px',
                        padding: '0.25rem 1rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i className="bi bi-eye me-1"></i> Details
                    </button>
                    <motion.button
                      className="btn btn-sm btn-success position-relative overflow-hidden"
                      onClick={() => addToFavorites(book._id)}
                      style={{
                        borderRadius: '20px',
                        padding: '0.25rem 1rem',
                        fontWeight: '500',
                        background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                        border: 'none',
                        boxShadow: '0 2px 5px rgba(76, 175, 80, 0.2)',
                        transform: 'scale(1)',
                        transformOrigin: 'center',
                      }}
                      whileTap={{ scale: 0.95 }}
                      disabled={animatingFavorites[book._id]}
                    >
                      <div className="d-flex align-items-center">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={animatingFavorites[book._id] ? 'saved' : 'save'}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="me-1"
                          >
                            {animatingFavorites[book._id] ? '❤️' : '🤍'}
                          </motion.span>
                        </AnimatePresence>
                        {animatingFavorites[book._id] ? 'Saved!' : 'Save'}
                      </div>
                      
                      {/* Ripple effect */}
                      {animatingFavorites[book._id] && (
                        <motion.span
                          className="position-absolute"
                          style={{
                            background: 'rgba(255, 255, 255, 0.7)',
                            borderRadius: '50%',
                            transform: 'scale(0)',
                            position: 'absolute',
                            width: '100px',
                            height: '100px',
                            marginTop: '-50px',
                            marginLeft: '-50px',
                            pointerEvents: 'none',
                          }}
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{ 
                            scale: 2, 
                            opacity: 0,
                            transition: { duration: 0.6, ease: 'easeOut' }
                          }}
                        />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <nav className="mt-5">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                &laquo;
              </button>
            </li>
            {[...Array(Math.min(5, pages)).keys()].map((x) => (
              <li
                key={x + 1}
                className={`page-item ${x + 1 === page ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(x + 1)}
                  style={{
                    minWidth: '40px',
                    textAlign: 'center',
                    border: 'none',
                    margin: '0 2px',
                    borderRadius: '8px',
                    color: x + 1 === page ? '#fff' : '#4b6cb7',
                    backgroundColor: x + 1 === page ? '#4b6cb7' : 'transparent',
                    boxShadow: x + 1 === page ? '0 2px 5px rgba(75, 108, 183, 0.3)' : 'none'
                  }}
                >
                  {x + 1}
                </button>
              </li>
            ))}
            {pages > 5 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            <li className={`page-item ${page === pages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setPage(p => Math.min(pages, p + 1))}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );

  // Helper function to generate random gradients for book covers
  function getRandomGradient() {
    const gradients = [
      ['#FF9A9E', '#FAD0C4'],
      ['#A1C4FD', '#C2E9FB'],
      ['#FFD1FF', '#FAD0C4'],
      ['#FFECD2', '#FCB69F'],
      ['#84FAB0', '#8FD3F4'],
      ['#A6C1EE', '#FBC2EB'],
      ['#FF9A9E', '#FECFEF']
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  }
};

export default Home;