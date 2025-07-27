import React, { useState, useEffect } from 'react'; // ✅ include useEffect
import releases from '../releaseData';
import './RabbitRelease.css';
import Sidebar from '../Components/Sidebar';

const RabbitRelease = () => {
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔁 Lock body scroll when modal is open
  useEffect(() => {
    document.title = "Rabbit-Release | DWebX WebApp";
    document.body.style.overflow = selectedRelease ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedRelease]);

  return (
    <div className="release-container">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <h2 className="title mt-5">🐇 RabbitXQ Releases</h2>

      <div className="release-grid">
        {releases.map((release, index) => (
          <div
            key={index}
            className="release-card"
            onClick={() => setSelectedRelease(release)}
          >
            <h3>{release.version}</h3>
            <p><strong>{release.title}</strong></p>
            <p className="date">{release.date}</p>
            <p>{release.summary}</p>
          </div>
        ))}
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
    </div>
  );
};

export default RabbitRelease;
