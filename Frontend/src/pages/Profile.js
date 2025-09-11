import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:5000/api/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error('Failed to fetch profile:', err);
        navigate('/login');
      });
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <p className="text-center mt-5">Loading profile...</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="text-success mb-3">Welcome, {user.name}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <hr />
        <h4 className="mb-3">Your Favorites:</h4>
        {user.favorites.length === 0 ? (
          <p>No favorite books yet.</p>
        ) : (
          <ul className="list-group">
            {user.favorites.map((book) => (
              <li key={book._id} className="list-group-item">
                <strong>{book.title}</strong> by {book.author}
              </li>
            ))}
          </ul>
        )}
        <button className="btn btn-danger mt-4" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;