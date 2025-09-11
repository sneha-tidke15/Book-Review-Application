import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/books/${id}`)
      .then((res) => {
        setBook(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load book:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading book details...</p>;
  if (!book) return <p className="text-center mt-5 text-danger">Book not found.</p>;

  return (
    <div className="container mt-5">
      {/* 📘 Book Info */}
      <div className="card shadow p-4 mb-4">
        <h2 className="text-primary">{book.title}</h2>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Description:</strong> {book.description || 'No description available.'}</p>
      </div>

      {/* ✍️ Review Form */}
      <div className="card shadow p-4 mb-4">
        <ReviewForm bookId={book._id} />
      </div>

      {/* 💬 Reviews Section */}
      <div className="card shadow p-4">
        <h4 className="mb-3 text-secondary">Reviews</h4>
        {book.reviews && book.reviews.length > 0 ? (
          book.reviews.map((review) => (
            <div key={review._id || Math.random()} className="border-bottom pb-3 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <strong>{review.name || 'Anonymous'}</strong>
                <span className="badge bg-warning text-dark">{review.rating} ★</span>
              </div>
              <p className="mt-2 mb-0">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-muted">No reviews yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};

export default BookDetails;