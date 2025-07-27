import '../css/Group.css';
import React, { useEffect, useState } from 'react';
import { FaUsers, FaRocket } from 'react-icons/fa';
import { TbCoinFilled } from 'react-icons/tb';
import Sidebar from '../Components/Sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // User state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [referCode, setReferCode] = useState('');
    const [error, setError] = useState('');

    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if (!token) {
    //         navigate("/login");
    //     }
    // }, [navigate]);


    useEffect(() => {
        document.title = "Your Profile | DWebX WebApp";
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('https://dwebx-webapi-production-73b4.up.railway.app/api/user/get', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const user = res.data;
                setUsername(user.username);
                setEmail(user.email);
                setReferCode(user.referralCode);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch user data');
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="home-container d-flex flex-column text-white">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="container mt-4">
                <h3 className="mb-4">Profile Details</h3>

                {error && <p className="text-danger">{error}</p>}

                <div className="form-group mb-3">
                    <label htmlFor="username" className='text-blue mb-2 ms-2'>Username</label>
                    <input
                        type="text"
                        className=" gradient-input "
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="email" className='text-blue mb-2 ms-2'>Email</label>
                    <input
                        type="email"
                        className=" gradient-input"
                        id="email"
                        value={email}
                        readOnly
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="referCode" className='text-blue mb-2 ms-2'>Refer Code</label>
                    <input
                        type="text"
                        className=" gradient-input"
                        id="referCode"
                        value={referCode}
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
};

export default Profile;
