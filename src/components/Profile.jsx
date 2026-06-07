import { ArrowLeft, User, Bell, Shield, LogOut, Settings, ChevronRight, Activity, Smartphone, Edit2, Check, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import InterruptionOverlay from './InterruptionOverlay';
import './profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState('');
  const [editName, setEditName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userInitials, setUserInitials] = useState('E');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const name = user.displayName || user.email?.split('@')[0] || '';
        setUserName(name);
        setEditName(name);
        setUserEmail(user.email || '');
        setUserInitials(name ? name.slice(0, 2).toUpperCase() : 'E');
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSaveName = async () => {
    try {
      if (auth.currentUser && editName.trim()) {
        await updateProfile(auth.currentUser, { displayName: editName.trim() });
        setUserName(editName.trim());
        setUserInitials(editName.trim().slice(0, 2).toUpperCase());
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating name:', error);
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => navigate('/login')).catch(() => navigate('/login'));
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
              <span>{userInitials}</span>
            </div>
            <div className="profile-user-info">
              {isEditing ? (
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-transparent border-b border-primary outline-none px-1 py-0.5 text-on-surface w-full max-w-[150px] font-semibold text-lg"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="p-1 rounded-full bg-[#4CAF50]/10 text-[#4CAF50] hover:bg-[#4CAF50]/20 transition-colors">
                    <Check size={16} />
                  </button>
                  <button onClick={() => { setIsEditing(false); setEditName(userName); }} className="p-1 rounded-full bg-[#F44336]/10 text-[#F44336] hover:bg-[#F44336]/20 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3>{userName || 'User'}</h3>
                  <button onClick={() => setIsEditing(true)} className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center cursor-pointer">
                    <Edit2 size={16} />
                  </button>
                </div>
              )}
              <p>{userEmail || 'user@example.com'}</p>
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

      {/* Global Interruption Overlay (Simulation) */}
      <InterruptionOverlay isOpen={showOverlay} onClose={() => setShowOverlay(false)} />
    </div>
  );
}
