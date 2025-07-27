import React, { useState, useEffect } from 'react';
import {
    FaBars, FaTimes, FaHome, FaQuestionCircle, FaSignOutAlt
} from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoRocket, IoSettings } from 'react-icons/io5';
import { MdGroups, MdLeaderboard } from 'react-icons/md';
import Logo from '../image/logo-2.2.png'
import './SidebarLayout.css';
import '../css/font.css';

const Sidebar = ({ children, sidebarOpen, setSidebarOpen, coins, coinChangeAnim }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showCoins, setShowCoins] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/home';

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    const handleSignOut = () => {
        localStorage.clear();
        setShowLogoutConfirm(false);
        navigate('/login');
    };



    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('sidebar-open');
        } else {
            document.body.classList.remove('sidebar-open');
        }
    }, [isOpen]);

    return (
        <>
            {/* Top Navbar */}
            <nav className="navbar navbar-dark bg-dark px-3 fixed-top d-flex justify-content-between align-items-center" style={{ zIndex: 1020 }}>
                {/* Toggle Sidebar Button */}
                <button className="btn btn-dark" onClick={toggleSidebar}>
                    <FaBars />
                </button>

                {/* 🪙 Coin Balance (only on Home) */}
                {isHomePage && (
                    <div
                        className={`text-white fw-bold d-flex align-items-center gap-1 ${coinChangeAnim ? 'coin-animated' : ''}`}
                        style={{ fontSize: '1rem', cursor: 'pointer' }}
                        onClick={() => setShowCoins(!showCoins)}
                        title={showCoins ? "Hide Balance" : "Show Balance"}
                    >
                        <span style={{ fontSize: '1.2rem' }}>
                            {showCoins ? '👁‍🗨' : '👁‍🗨'}
                        </span>
                        <span style={{ fontSize: '1.1rem' }}>
                            {
                                showCoins
                                    ? coins?.toFixed(4)
                                    : '*'.repeat(coins?.toFixed(4).length || 6)
                            }
                        </span>
                        <span className=''>DWX</span>
                    </div>
                )}

                {/* App Title */}
                {/* <span className="navbar-brand ms-2">DWebX</span> */}
                <img src={Logo} className='w-25' alt="" />
            </nav>

            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <span className="sidebar-logo">DWebX</span>
                    <button className="close-btn" onClick={closeSidebar}><FaTimes /></button>
                </div>
                <ul>
                    <Link to="/home" className="text-white text-decoration-none">
                        <li><FaHome className='me-2 fs-3 text-purple' />Home</li>
                    </Link>
                    <Link to="/rabbit-release" className="text-white text-decoration-none">
                        <li><IoRocket className='me-2 fs-3 text-purple' />DWebX Releases</li>
                    </Link>
                    <Link to="/group" className="text-white text-decoration-none">
                        <li><MdGroups className='me-2 fs-3 text-purple' />Group</li>
                    </Link>
                    <Link to="/leaderboard" className="text-white text-decoration-none">
                        <li><MdLeaderboard className='me-2 fs-3 text-purple' />LeaderBoard</li>
                    </Link>
                    <Link to="/profile" className="text-white text-decoration-none">
                        <li><IoSettings className='me-2 fs-3 text-purple' />Setting</li>
                    </Link>
                    {/* <Link to="#" className="text-white text-decoration-none">
                        <li><FaQuestionCircle className='me-2 fs-3 text-purple' />FAQ</li>
                    </Link> */}
                    <span className="text-white text-decoration-none" onClick={() => setShowLogoutConfirm(true)}>
                        <li><FaSignOutAlt className='me-2 fs-3 text-purple' />Sign Out</li>
                    </span>
                </ul>
            </div>

            {/* Backdrop */}
            {isOpen && <div className="backdrop" onClick={closeSidebar}></div>}

            {/* Main Content */}
            <div className={`main-content ${isOpen ? 'blur' : ''}`}>
                {children}
            </div>

            {/* Logout Confirmation */}
            {showLogoutConfirm && (
                <div className="logout-popup d-flex flex-column justify-content-center align-items-center text-white">
                    <div className="popup-inner text-center">
                        <p className="mb-4 fw-bold">Are you sure you want to sign out?</p>
                        <div className="d-flex justify-content-center gap-3">
                            <button className="btn btn-sm btn-light" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                            <button className="btn btn-sm btn-danger" onClick={handleSignOut}>Sign Out</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
