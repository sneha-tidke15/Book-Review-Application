import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axiosInstance.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
                    <h2 className="fw-bold text-primary">Welcome Back</h2>
                    <p className="text-muted">Sign in to continue to BookReview</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
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
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label htmlFor="password" className="form-label fw-medium text-muted mb-0">
                          Password
                        </label>
                        <Link to="/forgot-password" className="text-decoration-none small text-primary">
                          Forgot password?
                        </Link>
                      </div>
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
                            Sign In <FiArrowRight className="ms-2" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>

                  <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-primary text-decoration-none fw-medium">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Right Side - Image */}
                <div className="col-lg-6 d-none d-lg-block bg-primary bg-opacity-10 p-0 position-relative">
                  <div className="h-100 d-flex flex-column justify-content-center p-5 text-center">
                    <h3 className="text-primary mb-4">Discover Great Books</h3>
                    <p className="text-muted mb-4">
                      Join our community of book lovers and share your thoughts on the latest reads.
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
    </div>
  );
};

export default Login;