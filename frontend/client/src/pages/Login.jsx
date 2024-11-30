import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/Auth.css';
import Footer from '../components/Footer/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Both fields are required!');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        email,
        password,
      });

      setMessage('Login successful!');
      setError('');
      localStorage.setItem('token', response.data.token);

      const decoded = jwtDecode(response.data.token);
      console.log('Decoded token:', decoded);
      localStorage.setItem('userId', decoded.userId);

      if (decoded.isAdmin === true) {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Something went wrong, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <h2 className="auth__title">Login to Your Account</h2>

        {error && <p className="auth__error">{error}</p>}
        {message && <p className="auth__message">{message}</p>}

        <form className="auth__form" onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <button
            type="submit"
            className="auth__button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth__text">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
