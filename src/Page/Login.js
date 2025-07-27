import React, { useEffect, useState } from 'react';
import '../css/Auth.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../image/logo-2.2.png';

const Login = () => {

  useEffect(() => {
    document.title = "Login Page | DWebX WebApp";
  }, []);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        'https://dwebx-webapi-production-73b4.up.railway.app/api/user/login',
        formData
      );
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user.id);

      navigate('/'); // redirect after login
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box text-center">
        <img src={Logo} width="70%" className="text-center" alt="Logo" />
        <h2 className="text-color">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control auth-input"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            required
          />
          <input
            type="password"
            className="form-control auth-input"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            required
          />

          {/* Forgot Password link */}
          <div className="text-end mt-1">
            <span
              style={{ cursor: 'pointer', color: '#1e7ad6', fontSize: '0.9rem' }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </span>
          </div>

          <button className="btn btn-success w-100 mt-3" type="submit">
            Login
          </button>
        </form>

        {error && <p className="text-danger mt-2">{error}</p>}

        <p className="switch-link mt-3 text-center">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            style={{ cursor: 'pointer', color: '#1e7ad6' }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
