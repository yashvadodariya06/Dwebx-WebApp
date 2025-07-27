import '../css/Group.css';
import React, { useState, useEffect } from 'react';
import { FaUsers, FaRocket } from 'react-icons/fa';
import Sidebar from '../Components/Sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from '../image/logo-only-d-1.png';
import SocialAd from '../Ads/SocialAd';

const Group = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [referralCode, setReferralCode] = useState('');
    const [referralLink, setReferralLink] = useState('');
    const [referredUsers, setReferredUsers] = useState([]);
    const [claimedRewards, setClaimedRewards] = useState([]);

    useEffect(() => {
        document.title = "Group Page | DWebX WebApp";
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchReferralData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://dwebx-webapi-production-73b4.up.railway.app/api/user/get-refer-user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setReferralCode(response.data.referralCode);
                setReferredUsers(response.data.referredUsers);
                setClaimedRewards(response.data.referralRewards || []);

                const domain = window.location.origin;
                setReferralLink(`${domain}/signup?ref=${response.data.referralCode}`);
            } catch (error) {
                console.error('Failed to fetch referred users:', error);
            }
        };

        fetchReferralData();
    }, []);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink).then(() => {
            toast.success("Link copied to clipboard!", {
                style: {
                    background: '#1b70c5',
                    color: 'white',
                    fontWeight: 'bold',
                },
                icon: '✅',
                progressStyle: {
                    background: 'white',
                },
            });
        });
    };

    const handleClaimReward = async (level) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                'https://dwebx-webapi-production-73b4.up.railway.app/api/user/claim-reward',
                { level },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // ✅ Add level to claimed rewards
            setClaimedRewards(prev => [...prev, level]);

            // ✅ Show success toast with reward info
            toast.success(`🎉 Reward claimed! +${response.data.rewardCoins} DWX added`, {
                icon: '💰',
                style: {
                    background: '#1b70c5',
                    color: 'white',
                    fontWeight: 'bold',
                }
            });

            // ✅ Optional: re-fetch referral data to refresh coins/referred users
            const refetch = await axios.get('https://dwebx-webapi-production-73b4.up.railway.app/api/user/get-refer-user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReferredUsers(refetch.data.referredUsers);
            setClaimedRewards(refetch.data.referralRewards || []);

        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to claim reward");
        }
    };


    const rewardLevels = [
        { level: 1, coins: 50 },
        { level: 3, coins: 250 },
        { level: 5, coins: 700 }
    ];

    return (
        <div className="home-container d-flex flex-column text-white">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <SocialAd />

            <div className="text-center mt-5 pt-5 d-flex align-items-center justify-content-between mx-3">
                <p className='mb-0 text-secondary fw-bold Copy_code'>
                    <span className='text-info fs-5'>{referralCode}</span>
                </p>

                <div className='bg-share-link fw-semibold'>
                    <button className="btn btn-info px-4 py-1 fw-semibold fs-5" onClick={handleCopyLink}>
                        Copy Link
                    </button>
                </div>
            </div>

            <div className="text-center mt-4">
                <p className='px-3 fs-6 text-warning'>
                    Invite friends using your referral link and earn rewards when they join
                </p>
            </div>

            <div className="container my-3">
                <div className="row justify-content-center gap-3">

                    {rewardLevels.map(({ level, coins }) => {
                        const isClaimed = claimedRewards.includes(level);
                        const hasEnoughReferrals = referredUsers.length >= level;

                        return (
                            <div className="col-10 referral-box text-center" key={level}>
                                <p className="mb-0 fs-5">
                                    Invite <span className="text-pulple fw-bold">{level}</span> friend{level > 1 ? 's' : ''} to get <span className="text-pulple fw-bold">+{coins} DWX</span>
                                </p>

                                {/* Show Check button ONLY if enough referrals */}
                                {hasEnoughReferrals && (
                                    <div className="mt-2">
                                        <button
                                            className="btn btn-success px-3 py-1"
                                            disabled={isClaimed}
                                            onClick={() => handleClaimReward(level)}
                                        >
                                            {isClaimed ? "✅ Claimed" : "Check"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="text-center mt-4">
                <p className='px-3 fs-3 text-white'>
                    ==== Your Friends ====
                </p>
            </div>

            {referredUsers.map((user, index) => (
                <div className="d-flex justify-content-center mt-3 mx-3" key={user._id}>
                    <div className="leaderboard-card d-flex align-items-center justify-content-between px-3 py-2 rounded-4 shadow-sm w-100">
                        <div className="d-flex align-items-center gap-0">
                            <div className="rank-circle fw-bold">#{index + 1}</div>
                            <span className="text-white fw-semibold">{user.username}</span>
                        </div>
                        <div className="text-white fw-semibold">
                            {user.coins?.$numberDecimal
                                ? `${parseFloat(user.coins.$numberDecimal).toFixed(4)}`
                                : '0.0000'} <span className="text-info">DWX</span>
                        </div>
                    </div>
                </div>
            ))}

            <div className="fixed-bottom py-md-3 py-1 d-flex justify-content-between bg-black align-items-center">
                <div className="text-center bg-dark_1 text-pulple" onClick={() => navigate('/group')}>
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

            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default Group;
