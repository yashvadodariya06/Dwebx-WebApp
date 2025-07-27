import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Auth.css';
import Logo from '../image/logo-2.2.png';

const ForgotPassword = () => {

  useEffect(() => {
    document.title = "Forgot Password | Your App Name";
  }, []);

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false); // NEW STATE
  const [formData, setFormData] = useState({
    email: '',
    enteredOtp: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);
    try {
      await axios.post('https://dwebx-webapi-production-73b4.up.railway.app/api/user/send-otp', {
        email: formData.email
      });
      setMessage('OTP sent to your email!');
      setIsError(false);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error sending OTP');
      setIsError(true);
    }
    setLoading(false);
  };

  const verifyOtp = async e => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    if (!formData.enteredOtp) {
      setMessage('Please enter the OTP');
      setIsError(true);
      return;
    }
    setStep(3);
  };

  const resetPassword = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords don't match");
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      await axios.post('https://dwebx-webapi-production-73b4.up.railway.app/api/user/reset-password', {
        email: formData.email,
        enteredOtp: formData.enteredOtp,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      setMessage('Password reset successful!');
      setIsError(false);
      navigate('/login');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to reset password');
      setIsError(true);
    }

    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box text-center">
        <img src={Logo} width="70%" className="text-center" alt="Logo" />
        <h5 className="text-color">Forgot Password</h5>

        {/* Message Box */}
        {message && (
          <p style={{ color: isError ? 'red' : 'green', fontSize: '14px' }}>{message}</p>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={sendOtp}>
            <input
              type="email"
              className="form-control auth-input"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              value={formData.email}
              required
            />
            <button className="btn btn-primary w-100 mt-3" type="submit" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={verifyOtp}>
            <input
              type="text"
              className="form-control auth-input"
              name="enteredOtp"
              placeholder="Enter OTP"
              onChange={handleChange}
              value={formData.enteredOtp}
              required
            />
            <button className="btn btn-primary w-100 mt-3" type="submit">
              Verify OTP
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={resetPassword}>
            <input
              type="password"
              className="form-control auth-input"
              name="password"
              placeholder="New Password"
              onChange={handleChange}
              value={formData.password}
              required
            />
            <input
              type="password"
              className="form-control auth-input mt-2"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              value={formData.confirmPassword}
              required
            />
            <button className="btn btn-success w-100 mt-3" type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Link to login */}
        <p className="switch-link mt-3 text-center">
          Remembered your password?{' '}
          <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: '#1e7ad6' }}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
