import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ bookId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/books/${bookId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Review submitted!');
      setRating(5);
      setComment('');
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Failed to submit review. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4 className="mb-3 text-success">Leave a Review</h4>

      <div className="mb-3">
        <label htmlFor="rating" className="form-label">Rating</label>
        <select
          id="rating"
          className="form-select"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r} Star</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="comment" className="form-label">Comment</label>
        <textarea
          id="comment"
          className="form-control"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your thoughts..."
          required
        />
      </div>

      <button type="submit" className="btn btn-success">Submit Review</button>
    </form>
  );
};

export default ReviewForm;