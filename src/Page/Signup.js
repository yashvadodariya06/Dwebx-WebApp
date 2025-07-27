import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/Auth.css';
import Logo from '../image/logo-2.2.png';

const Signup = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [referralFromLink, setReferralFromLink] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        referralCode: '',
        enteredOtp: ''
    });

    // GET REFERRAL CODE FROM URL ONCE
    useEffect(() => {
        document.title = "Sign-up Page  | DWebX WebApp";
        const params = new URLSearchParams(location.search);
        const ref = params.get('ref');
        if (ref) {
            setFormData(prev => ({ ...prev, referralCode: ref }));
            setReferralFromLink(ref);
        }
    }, [location.search]);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendOtp = async e => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await axios.post('https://dwebx-webapi-production-73b4.up.railway.app/api/user/send-otp', { email: formData.email });
            setMessage('OTP sent to your email!');
            setStep(2);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error sending OTP');
        }
        setLoading(false);
    };

    const verifyOtp = async e => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await axios.post('https://dwebx-webapi-production-73b4.up.railway.app/api/user/register', formData);
            setMessage('Registration successful!');
            navigate('/login');
        } catch (err) {
            setMessage(err.response?.data?.message || 'OTP verification or registration failed');
        }
        setLoading(false);
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-box text-center">
                <img src={Logo} width="70%" className='text-center' alt="" />
                <h2 className='text-color'>Sign-Up</h2>
                {message && <p style={{ color: '#ccc', fontSize: '14px' }}>{message}</p>}

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
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        setStep(3);
                    }}>
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

                {step === 3 && (
                    <form onSubmit={verifyOtp}>
                        <input
                            type="text"
                            className="form-control auth-input"
                            name="username"
                            placeholder="Username"
                            onChange={handleChange}
                            value={formData.username}
                            required
                        />
                        <input
                            type="password"
                            className="form-control auth-input mt-2"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            value={formData.password}
                            required
                        />
                        <input
                            type="text"
                            className="form-control auth-input mt-2"
                            name="referralCode"
                            placeholder="Referral Code (optional)"
                            value={formData.referralCode}
                            onChange={handleChange}
                            disabled={!!referralFromLink} // lock if from URL
                        />
                        <button className="btn btn-success w-100 mt-3" type="submit" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                )}

                <p className="switch-link mt-3 text-center">
                    Already have an account?{' '}
                    <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: '#1e7ad6' }}>Login</span>
                </p>
            </div>
        </div>
    );
};

export default Signup;
