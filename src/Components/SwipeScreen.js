import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/SwipeScreen.css';
import Logo from '../image/logo-2.2.png'

const SwipeScreen = () => {
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Swipe Screen| DWebX WebApp";
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, []);

  const handleStart = (e) => {
    setDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleMove = (e) => {
    if (!dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const containerWidth = containerRef.current.offsetWidth;
    const diff = Math.min(clientX - startX, containerWidth - 50);
    if (diff >= 0) {
      setTranslateX(diff);
    }
  };

  const handleEnd = () => {
    if (!dragging) return;
    setDragging(false);

    const containerWidth = containerRef.current.offsetWidth;

    if (translateX >= containerWidth - 60) {
      localStorage.setItem('swiped', 'true');
      navigate('/home');
    }

    setTranslateX(0);
  };

  return (
    <div className="mobile-view">
      <div className="content-wrapper">
        <div className="top-section">
          <div className="logo">
            {/* <h1 className="h1">DWebX</h1> */}
            <img src={Logo} width="80%" alt="" />
          </div>
          <h2 className="h2">Experience the future</h2>
          <p className="p">
            Immerse yourself in tomorrow, today - <br />
            where innovation meets imagination.
          </p>
        </div>

        <div
          className="swipe-button"
          ref={containerRef}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          <span className="swipe-label">SWIPE ME</span>
          <div
            className="arrow draggable-arrow"
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            style={{ transform: `translateX(${translateX}px)` }}
          >
            &#10132;
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeScreen;
