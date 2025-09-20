import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheck } from 'react-icons/fi';
import confetti from 'canvas-confetti';

// Success Popup Component
const SuccessPopup = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B']
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.7)', 
        zIndex: 1050,
        backdropFilter: 'blur(4px)'
      }}
    >
      <motion.div 
        className="bg-white p-5 rounded-4 text-center position-relative overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}
      >
        <div className="d-flex justify-content-center mb-4">
          <div className="bg-success bg-opacity-10 rounded-circle p-3">
            <FiCheck className="text-success" size={40} />
          </div>
        </div>
        
        <h4 className="fw-bold text-success mb-3">Registration Successful!</h4>
        <p className="text-muted mb-4">
          Thank you for joining BookReview! You can now sign in to your account.
        </p>
        
        <button 
          onClick={onClose}
          className="btn btn-primary px-4 py-2 rounded-pill"
        >
          Continue to Login
        </button>
      </motion.div>
    </motion.div>
  );
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      const { confirmPassword, ...userData } = formData;
      await axiosInstance.post('/api/auth/register', userData);
      setIsSuccess(true);
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B']
      });
      
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setIsSuccess(false);
    navigate('/login');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <motion.div 
              className="card border-0 shadow-lg rounded-4 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="row g-0">
                {/* Left Side - Form */}
                <div className="col-lg-6 p-5">
                  <div className="text-center mb-5">
                    <h2 className="fw-bold text-primary">Create Account</h2>
                    <p className="text-muted">Join our community of book lovers</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label fw-medium text-muted mb-2">
                        Full Name
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FiUser className="text-muted" />
                        </span>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="form-control border-start-0 ps-2"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-medium text-muted mb-2">
                        Email Address
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FiMail className="text-muted" />
                        </span>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="form-control border-start-0 ps-2"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label fw-medium text-muted mb-2">
                        Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FiLock className="text-muted" />
                        </span>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          className="form-control border-start-0 ps-2"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength="6"
                        />
                      </div>
                      <div className="form-text text-muted small">Must be at least 6 characters</div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label fw-medium text-muted mb-2">
                        Confirm Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FiLock className="text-muted" />
                        </span>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          className="form-control border-start-0 ps-2"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <motion.button
                        type="submit"
                        className="btn btn-primary btn-lg rounded-pill fw-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <>
                            Create Account <FiArrowRight className="ms-2" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>

                  <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="text-primary text-decoration-none fw-medium">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Right Side - Image */}
                <div className="col-lg-6 d-none d-lg-block bg-primary bg-opacity-10 p-0 position-relative">
                  <div className="h-100 d-flex flex-column justify-content-center p-5 text-center">
                    <h3 className="text-primary mb-4">Join Our Community</h3>
                    <p className="text-muted mb-4">
                      Share your thoughts, discover new books, and connect with fellow readers.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                      <div className="bg-white p-2 rounded-circle shadow-sm">
                        <div className="d-flex align-items-center justify-content-center rounded-3 bg-light" style={{width: '50px', height: '50px'}}>
                          <span className="text-muted">📚</span>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-circle shadow-sm">
                        <div className="d-flex align-items-center justify-content-center rounded-3 bg-light" style={{width: '50px', height: '50px'}}>
                          <span className="text-muted">📖</span>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-circle shadow-sm">
                        <div className="d-flex align-items-center justify-content-center rounded-3 bg-light" style={{width: '50px', height: '50px'}}>
                          <span className="text-muted">📕</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {isSuccess && <SuccessPopup onClose={handleCloseSuccess} />}
    </div>
  );
};

export default Register;