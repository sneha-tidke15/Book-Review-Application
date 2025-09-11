import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setFavorites(res.data.favorites || []);
      })
      .catch((err) => {
        console.error('Failed to load favorites:', err);
        navigate('/login');
      });
  }, [token, navigate]);

  const removeFavorite = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/favorites/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(favorites.filter((book) => book._id !== bookId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  const viewDetails = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-info mb-4">Your Favorite Books</h2>
      {favorites.length === 0 ? (
        <div className="alert alert-warning">No favorites yet.</div>
      ) : (
        <div className="row">
          {favorites.map((book) => (
            <div key={book._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm border-primary">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title text-primary">{book.title}</h5>
                    <p className="card-text text-muted">by {book.author}</p>
                  </div>
                  <div className="mt-3 d-grid gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => viewDetails(book._id)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeFavorite(book._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;