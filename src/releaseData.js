const releases = [
    {
        version: "v1.0.0",
        title: "Genesis Launch",
        date: "26 June 2025",
        summary: "First release with session mining, referrals, and live coin updates.",
        fullDetails: `
The RabbitXQ team is proud to announce the Genesis Launch of our next-generation crypto mining and referral rewards web app. This release marks the foundation of an ecosystem where users can mine coins, build networks, and grow passively—powered by speed, simplicity, and scalability.

🧩 Core Features:
- Secure signup/login with JWT
- 24-hour mining session with multiplier
- Real-time coin updates with Socket.io
- Referral system with bonuses
- Mobile responsive dark mode UI

⚙️ Performance:
- Optimized for 50+ live sessions
- Load time under 1.2s
- Throttled updates for low memory devices

🐞 Bug Fixes:
- Session bugs, UI glitches, and Safari issues resolved

📌 Developer Note:
"This is just the beginning. We're building with the community in mind."

`
    },
    {
        version: "v1.1.0",
        title: "Referral+ Expansion",
        date: "2 July 2025",
        summary: "Referral bonuses, auto-sessions, leaderboard system introduced.",
        fullDetails: `
🚀 New Features:
- Tiered referral rewards (Level 1 & Level 2)
- Referral leaderboard added
- Auto-reactivation for daily miners
- Dynamic invite link with stats

⚙️ Performance:
- Node.js cluster mode enabled
- MongoDB index optimizations

🐞 Bug Fixes:
- Fixed referral code duplication
- Resolved floating coin rounding issue

Fun Fact: Over 2.4 million coins mined since v1.0.0.
`
    },
    {
        version: "v1.2.0",
        title: "UI/UX Evolution",
        date: "10 July 2025",
        summary: "Revamped dashboard, animations, and mobile improvements.",
        fullDetails: `
🎨 What's New:
- Redesigned Mining Card and dashboard
- New profile badges and QR referral system
- Coin float animation every 3 seconds
- Graph of coins over time

📱 Mobile Fixes:
- Keyboard overlap on Android
- Persistent session on background

⚙️ Optimization:
- 40% faster loading
- Dashboard lazy loaded

🐞 Fixed:
- Graph scale bug
- Tab restore issue
`
    },
    // Add more releases here...
];

export default releases;
