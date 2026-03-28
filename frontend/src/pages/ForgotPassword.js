import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword } from '../api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await forgotPassword({ email });
      setMessage(response.data.message);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page" style={{ maxWidth: '500px', margin: '3rem auto' }}>
      <div className="card">
        <h2 className="text-center mb-3">Forgot Password</h2>
        <p className="text-center mb-3">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {message && <div className="alert alert-success mb-3">{message}</div>}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="text-center mt-3">
          <p>
            Remember your password?{' '}
            <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;