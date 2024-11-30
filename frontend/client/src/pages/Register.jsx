import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError('All fields are required!');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:3001/auth/register', {
        username,
        email,
        password,
        isAdmin,
      });

      setMessage('Registration successful!');
      setError('');
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      setError(error.response?.data?.error || 'Something went wrong, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <h2 className="auth__title">Create Your Account</h2>

        {error && <p className="auth__error">{error}</p>}
        {message && <p className="auth__message">{message}</p>}

        <form className="auth__form" onSubmit={handleRegister}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />

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

          {/* <label className="auth__checkbox-label">
            Admin?
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={() => setIsAdmin(!isAdmin)}
            />
          </label> */}

          <button
            type="submit"
            className="auth__button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth__text">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
