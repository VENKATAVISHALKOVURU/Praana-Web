import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/onboarding');
  };

  return (
    <div className="auth-page">
      {/* Sidebar for Desktop */}
      <div className="auth-sidebar">
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent 50%)'
        }}></div>
        <h2 style={{ fontSize: '32px', fontWeight: '500', marginBottom: '16px', fontFamily: "'Sora', sans-serif", zIndex: 1 }}>Begin your journey.</h2>
        <p style={{ fontSize: '18px', opacity: 0.8, maxWidth: '300px', lineHeight: 1.5, zIndex: 1 }}>
          Create an account to personalize your conscious space.
        </p>
      </div>

      {/* Form Container */}
      <div className="auth-form-container">
        
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative', width: '24px', height: '24px' }}>
              <div style={{ position: 'absolute', top: '0px', right: '2px', width: '10px', height: '10px', borderRadius: '50%', border: '2px solid var(--color-primary)' }}></div>
              <div style={{ position: 'absolute', top: '8px', left: '0px', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid var(--color-primary)' }}></div>
              <div style={{ position: 'absolute', bottom: '0px', right: '6px', width: '6px', height: '6px', borderRadius: '50%', border: '2px solid var(--color-primary)' }}></div>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary)' }}>Praana</h2>
          </div>
        </div>

        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px' }}>Create an Account</h1>
            <p className="subtitle" style={{ marginBottom: '8px' }}>This space adapts gently to you.</p>
          </div>

          <form onSubmit={handleSignup}>
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <input type="text" placeholder="Elias Thorne" required />
              </div>
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <input type="email" placeholder="hello@praana.co" required />
              </div>
            </div>

            <div className="input-group">
              <label>Create Password</label>
              <div className="input-wrapper">
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" required />
                <div className="input-icon" style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-4" onClick={() => navigate('/onboarding')}>
              Continue
            </button>
          </form>

          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', backgroundColor: '#fcfdfa', marginTop: '16px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="footer-link">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '24px', fontSize: '10px', letterSpacing: '1px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
          <span style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-border)', marginRight: '12px' }}></span>
          EDITORIAL PRECISION
          <span style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-border)', marginLeft: '12px' }}></span>
        </div>
      </div>
    </div>
  );
}
