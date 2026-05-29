import { ArrowLeft, User, Bell, Shield, LogOut, Settings, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import './profile.css';

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Navigate back to login
    navigate('/login');
  };

  return (
    <div className="page-container profile-page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ marginRight: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <div className="header-brand">
          <h2>Profile & Settings</h2>
        </div>
      </header>

      <div className="profile-content">
        {/* User Card */}
        <div className="settings-section">
          <div className="profile-user-card">
            <div className="profile-avatar-large">
              <span>E</span>
            </div>
            <div className="profile-user-info">
              <h3>Elias Thorne</h3>
              <p>elias.thorne@example.com</p>
              <span className="member-badge">Member since Oct 2023</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="settings-section">
          <h4 className="section-title">App Preferences</h4>
          
          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item-left">
                <div className="settings-icon"><Bell size={20} /></div>
                <div className="settings-text">
                  <h5>Nudge Style</h5>
                  <p>Gentle reminders</p>
                </div>
              </div>
              <ChevronRight size={20} color="var(--on-surface-variant)" />
            </div>

            <div className="settings-item">
              <div className="settings-item-left">
                <div className="settings-icon"><Settings size={20} /></div>
                <div className="settings-text">
                  <h5>Saathi AI Tone</h5>
                  <p>Empathetic & Reflective</p>
                </div>
              </div>
              <ChevronRight size={20} color="var(--on-surface-variant)" />
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="settings-section">
          <h4 className="section-title">Privacy & Data</h4>
          
          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item-left">
                <div className="settings-icon"><Shield size={20} /></div>
                <div className="settings-text">
                  <h5>Data Analytics</h5>
                  <p>Anonymous wellness metrics</p>
                </div>
              </div>
              <div className="toggle-switch active">
                <div className="toggle-knob"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="settings-section" style={{ marginTop: '32px' }}>
          <button className="btn-outline danger-btn w-full flex-center" onClick={handleLogout}>
            <LogOut size={18} style={{ marginRight: '8px' }} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
