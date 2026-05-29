import './app-pages.css';
import { Users, MoreHorizontal, Pause, Play, LogOut, RotateCcw } from 'lucide-react';

export default function Rooms() {
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
            <span className="time">24:56</span>
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
        <button className="control-action">
          <div className="icon-circle"><RotateCcw size={18} /></div>
          <span>Extend</span>
        </button>
        <button className="control-action main-action">
          <div className="icon-circle primary"><Pause fill="currentColor" size={24} /></div>
          <span>Focusing</span>
        </button>
        <button className="control-action danger">
          <div className="icon-circle"><LogOut size={18} /></div>
          <span>Leave</span>
        </button>
      </div>
    </div>
  );
}
