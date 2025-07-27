import React, { useState, useEffect, useRef } from 'react';
import { FaBolt, FaUsers, FaRocket } from 'react-icons/fa';
import Sidebar from '../Components/Sidebar';
import '../css/Home.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import socket from '../utils/socket';
import releases from '../releaseData';
import { toast, ToastContainer } from 'react-toastify';
import Logo from '../image/logo-only-d-1.png';
import 'react-toastify/dist/ReactToastify.css';
import '../css/font.css';

const Home = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [miningStartTime, setMiningStartTime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [coins, setCoins] = useState(0);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isCoinButtonDisabled, setIsCoinButtonDisabled] = useState(false);
    const [isBoostDisabled, setIsBoostDisabled] = useState(false);
    const [coinChangeAnim, setCoinChangeAnim] = useState(false);
    const [selectedRelease, setSelectedRelease] = useState(null);
    const navigate = useNavigate();
    const prevCoinsRef = useRef(0);
    const BOOST_LINK = "https://www.profitableratecpm.com/kbsy0489cy?key=1ffca4a71e9a725f6afb047d25792838";

    useEffect(() => {
        document.title = "Home Page | DWebX WebApp";
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const checkSessionStatus = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get("https://dwebx-webapi-production-73b4.up.railway.app/api/user/session-status", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const startTime = res.data.sessionStartTime ? new Date(res.data.sessionStartTime) : null;
            setMiningStartTime(startTime);
            setIsSessionActive(res.data.activeSession || false);

            const coinValue = parseFloat(res.data.coins?.$numberDecimal || res.data.coins || "0");
            setCoins(coinValue);
            prevCoinsRef.current = coinValue;

            if (startTime) {
                localStorage.setItem("miningStartTime", startTime.toISOString());
            } else {
                localStorage.removeItem("miningStartTime");
            }
        } catch (error) {
            console.error("Error checking session status:", error);
        }
    };

    useEffect(() => {
        checkSessionStatus();

        const lastClaimTime = localStorage.getItem("lastFreeCoinTime");
        if (lastClaimTime) {
            const now = new Date();
            const last = new Date(lastClaimTime);
            const diff = now - last;
            const hours12 = 12 * 60 * 60 * 1000;

            if (diff < hours12) {
                setIsCoinButtonDisabled(true);
                const remaining = hours12 - diff;
                const timeout = setTimeout(() => {
                    setIsCoinButtonDisabled(false);
                    localStorage.removeItem("lastFreeCoinTime");
                }, remaining);

                return () => clearTimeout(timeout);
            }
        }

        const failTime = localStorage.getItem("boostFailTime");
        if (failTime) {
            const now = Date.now();
            const diff = now - parseInt(failTime);
            const cooldown = 10 * 60 * 1000;

            if (diff < cooldown) {
                setIsBoostDisabled(true);
                const remaining = cooldown - diff;
                const timeout = setTimeout(() => {
                    setIsBoostDisabled(false);
                    localStorage.removeItem("boostFailTime");
                }, remaining);

                return () => clearTimeout(timeout);
            }
        }
    }, []);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!socket.connected) socket.connect();
        if (userId) socket.emit("join", userId);

        const handleCoinUpdate = (data) => {
            if (data.userId?.toString() === userId) {
                const newCoins = parseFloat(data.coins?.$numberDecimal || data.coins || 0);
                if (newCoins > prevCoinsRef.current) {
                    setCoinChangeAnim(true);
                    setTimeout(() => setCoinChangeAnim(false), 200);
                }
                prevCoinsRef.current = coins;
                setCoins(newCoins);
            }
        };

        const handleSessionEnd = () => {
            setMiningStartTime(null);
            setIsSessionActive(false);
            localStorage.removeItem("miningStartTime");
        };

        socket.on("coin_updated", handleCoinUpdate);
        socket.on("session_ended", handleSessionEnd);

        return () => {
            socket.off("coin_updated", handleCoinUpdate);
            socket.off("session_ended", handleSessionEnd);
        };
    }, [coins]);

    useEffect(() => {
        if (miningStartTime) {
            const interval = setInterval(() => {
                const now = new Date();
                const endTime = new Date(miningStartTime);
                endTime.setHours(endTime.getHours() + 24);
                const diff = endTime - now;

                if (diff <= 0) {
                    setMiningStartTime(null);
                    setTimeLeft(null);
                    localStorage.removeItem("miningStartTime");
                    clearInterval(interval);
                } else {
                    const hours = Math.floor(diff / 1000 / 60 / 60);
                    const minutes = Math.floor((diff / 1000 / 60) % 60);
                    const seconds = Math.floor((diff / 1000) % 60);
                    setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [miningStartTime]);

    useEffect(() => {
        document.body.style.overflow = selectedRelease ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [selectedRelease]);

    const startMining = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("https://dwebx-webapi-production-73b4.up.railway.app/api/user/start-session", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.activeSession) {
                const now = new Date(res.data.sessionStartTime);
                setMiningStartTime(now);
                setIsSessionActive(true);
                localStorage.setItem("miningStartTime", now.toISOString());

                const coinValue = parseFloat(res.data.coins?.$numberDecimal || res.data.coins || 0);
                setCoins(coinValue);
                prevCoinsRef.current = coinValue;

                toast.success("Mining started successfully!", {
                    style: { background: '#1b70c5', color: 'white', fontWeight: 'bold' },
                    icon: '⚡', progressStyle: { background: 'white' },
                });
            }
        } catch (err) {
            console.error("Error starting mining:", err);
        }
    };

    const handleGetFreeCoin = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.post("https://dwebx-webapi-production-73b4.up.railway.app/api/user/start-coin-process", {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success(res.data.message || "Coin process started!", {
                style: { background: '#1b70c5', color: 'white', fontWeight: 'bold' },
                icon: '🪙', progressStyle: { background: 'white' },
            });

            localStorage.setItem("lastFreeCoinTime", new Date().toISOString());
            setIsCoinButtonDisabled(true);
            setTimeout(() => {
                setIsCoinButtonDisabled(false);
                localStorage.removeItem("lastFreeCoinTime");
            }, 12 * 60 * 60 * 1000);

            setTimeout(() => {
                toast.success("🎉 Congrats! 50 DWebX has been added. Please refresh to see your updated balance.", {
                    style: { background: '#28a745', color: 'white', fontWeight: 'bold' },
                    icon: '🎊', progressStyle: { background: 'white' },
                });
                checkSessionStatus();
            }, 20000);

        } catch (err) {
            console.error("Error getting free coin:", err);
            toast.error(err.response?.data?.message || "Something went wrong", {
                style: { background: '#ff4d4d', color: 'white', fontWeight: 'bold' },
            });
        }
    };

    const handleBoostClick = () => {
        const clickTime = Date.now();
        localStorage.setItem("boostClickTime", clickTime.toString());
        window.open(BOOST_LINK, "_blank");

        setTimeout(() => {
            const returnTime = Date.now();
            const duration = returnTime - clickTime;

            if (duration < 20000) {
                localStorage.setItem("boostFailTime", Date.now().toString());
                setIsBoostDisabled(true);

                toast.error("⛔ You didn't stay long enough on the ad page. Try again in 10 minutes.", {
                    style: { background: '#d9534f', color: 'white', fontWeight: 'bold' },
                });

                setTimeout(() => {
                    setIsBoostDisabled(false);
                    localStorage.removeItem("boostFailTime");
                }, 10 * 60 * 1000);
            }
        }, 3000);
    };

    return (
        <div className="home-container d-flex flex-column text-white">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} coins={coins} coinChangeAnim={coinChangeAnim} />

            <div className="home-content flex-grow-1 mt-5 mb-1">
                <div className="mt-2 text-center">
                    <div className="title-text l-w fs-5">ATP DWebX Server</div>
                </div>
                <div className="text-white small mt-1 text-center title-text fs-6">
                    <span className='fs-3'>0.05 </span> DWEBX / h
                </div>
            </div>

            <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
                <div className="power-circle d-flex justify-content-center align-items-center">
                    <img src={Logo} className='image-logo' alt="" />
                </div>
            </div>

            <div className="text-center mt-5">
                {isSessionActive ? (
                    <button className="btn mt-4 btn-primary_3 px-5 rounded-pill title-text_2" disabled>
                        <span className="mining-timer-animated">{timeLeft || "Mining..."}</span>
                    </button>
                ) : (
                    <button className="btn btn-primary_2 text-white px-5 mt-5 rounded-pill title-text_2" onClick={startMining}>
                        Active DWebX Mining
                    </button>
                )}
            </div>

            <div className='text-center mt-3 mx-3 d-flex justify-content-between'>
                <button
                    className="btn-boost-coin"
                    onClick={handleBoostClick}
                    disabled={isBoostDisabled}
                    style={{
                        filter: isBoostDisabled ? "blur(1px)" : "none",
                        cursor: isBoostDisabled ? "not-allowed" : "pointer",
                    }}
                >
                    {isBoostDisabled ? "Try again in 10m" : "Boost + DWebX"}
                </button>

                <button
                    className="btn-boost-coin"
                    onClick={handleGetFreeCoin}
                    disabled={isCoinButtonDisabled}
                    style={{
                        filter: isCoinButtonDisabled ? "blur(1px)" : "none",
                        cursor: isCoinButtonDisabled ? "not-allowed" : "pointer",
                    }}
                >
                    {isCoinButtonDisabled ? "Available after 12h" : "Get +50 DWebX"}
                </button>
            </div>

            <div className="text-center mt-5 pt-3 mb-3">
                <div className="release-grid mt-3">
                    {releases.map((release, index) => (
                        <div key={index} className="release-card" onClick={() => setSelectedRelease(release)}>
                            <h5>{release.version}</h5>
                            <p><strong>{release.title}</strong></p>
                            <p className="date">{release.date}</p>
                            <p>{release.summary}</p>
                        </div>
                    ))}
                </div>
            </div>

            {selectedRelease && (
                <div className="release-modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setSelectedRelease(null)}>&times;</span>
                        <h2>{selectedRelease.version} – {selectedRelease.title}</h2>
                        <p><strong>Date:</strong> {selectedRelease.date}</p>
                        <div className="details">
                            <pre>{selectedRelease.fullDetails}</pre>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed-bottom py-md-3 py-1 d-flex justify-content-between bg-black align-items-center">
                <div className="text-center bg-dark_1" onClick={() => navigate('/group')}>
                    <FaUsers size={24} />
                    <span className="d-block">Group</span>
                </div>
                <div className="center-logo-button" onClick={() => navigate('/home')}>
                    <img src={Logo} alt="Logo" className="center-logo-img" />
                </div>
                <div className="text-center bg-dark_2" onClick={() => navigate('/leaderboard')}>
                    <FaRocket size={24} />
                    <span className="d-block">Board</span>
                </div>
            </div>

            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} />
        </div>
    );
};

export default Home;
