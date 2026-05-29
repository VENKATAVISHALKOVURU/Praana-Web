import React, { useState, useEffect } from 'react';
import './app-pages.css';
import { Users, MoreHorizontal, Pause, Play, LogOut, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Rooms() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins in seconds
  const [isRunning, setIsRunning] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleLeave = () => {
    navigate('/onboarding');
  };

  return (
    <div className="page-container rooms-page">
      <header className="page-header space-between">
        <div className="header-brand">
          <Users size={24} color="var(--primary)" />
          <h2>Focus Room #24</h2>
        </div>
        <button className="icon-btn"><MoreHorizontal size={20} /></button>
      </header>

      <div className="rooms-content">
        <div className="room-status-card">
          <div className="room-timer-large">
            <span className="time">{formatTime(timeLeft)}</span>
            <span className="label">MINUTES LEFT</span>
          </div>
          
          <div className="room-quote-section">
            <p className="quote">"Everyone is focusing quietly"</p>
            <p className="caption">A shared canopy of silence</p>
          </div>

          <div className="room-participants">
            <div className="avatar-group">
              <div className="avatar">👤</div>
              <div className="avatar">🧘</div>
              <div className="avatar">🌿</div>
              <div className="avatar more">+9</div>
            </div>
            <p className="active-count">12 active souls</p>
          </div>
        </div>
      </div>

      <div className="room-controls-bar">
        <button className="control-action" onClick={() => setTimeLeft(prev => prev + (5 * 60))}>
          <div className="icon-circle"><RotateCcw size={18} /></div>
          <span>Extend 5m</span>
        </button>
        <button className="control-action main-action" onClick={() => setIsRunning(!isRunning)}>
          <div className="icon-circle primary">
            {isRunning ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} />}
          </div>
          <span>{isRunning ? 'Focusing' : 'Paused'}</span>
        </button>
        <button className="control-action danger" onClick={handleLeave}>
          <div className="icon-circle"><LogOut size={18} /></div>
          <span>Leave</span>
        </button>
      </div>
    </div>
  );
}
