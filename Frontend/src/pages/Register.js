import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Success Popup Component
const SuccessPopup = ({ onClose }) => {
  // Confetti effect on mount
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
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      transition={{ duration: 0.3 }}
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.7)', 
        zIndex: 1050,
        fontFamily: '"Poppins", sans-serif'
      }}
    >
      <motion.div 
        className="bg-white p-5 rounded-4 text-center position-relative overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
          duration: 0.5
        }}
        style={{
          maxWidth: '400px',
          width: '90%',
          border: '1px solid rgba(0,0,0,0.1)'
        }}
      >
        {/* Animated Checkmark */}
        <motion.div 
          className="position-relative mx-auto mb-4"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
          }}
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            rotate: [0, 10, -10, 5, -5, 0],
          }}
          transition={{ 
            scale: { duration: 0.5, type: 'spring' },
            rotate: { duration: 0.8, delay: 0.3 }
          }}
        >
          <motion.svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.polyline points="20 6 9 17 4 12" />
          </motion.svg>
        </motion.div>
        
        <motion.h4 
          className="mb-3 fw-bold"
          style={{ color: '#2E7D32', fontSize: '1.5rem' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Welcome Aboard! 🎉
        </motion.h4>
        
        <motion.p 
          className="mb-4 text-muted"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Your account has been created successfully. Get ready to explore amazing books and share your thoughts!
        </motion.p>
        
        <motion.button 
          onClick={onClose}
          className="btn btn-lg w-100 py-2 fw-semibold"
          style={{
            background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
          whileHover={{ 
            scale: 1.03,
            boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)'
          }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Start Exploring
          <motion.span 
            className="position-absolute"
            style={{
              top: '50%',
              right: '15px',
              transform: 'translateY(-50%)',
              transition: 'transform 0.3s ease'
            }}
            animate={{ x: [0, 5, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              delay: 1
            }}
          >
            →
          </motion.span>
        </motion.button>
        
        {/* Decorative elements */}
        <motion.div 
          className="position-absolute"
          style={{
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1))',
            zIndex: -1
          }}
          animate={{
            transform: ['rotate(0deg)', 'rotate(360deg)']
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </motion.div>
    </motion.div>
  );
};

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      setShowSuccess(true);
      
      // Auto-navigate after 3 seconds if user doesn't click the button
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      
      return () => clearTimeout(timer);
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Registration failed. Please try again.');
    }
  };
  
  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <AnimatePresence>
        {showSuccess && <SuccessPopup onClose={handleSuccessClose} />}
      </AnimatePresence>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow">
            <h3 className="text-center mb-4 text-success">Register</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;