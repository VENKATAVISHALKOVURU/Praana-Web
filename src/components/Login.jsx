import { Link, useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from '../firebase';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is returning from a mobile Google login redirect
    getRedirectResult(auth).then((result) => {
      if (result) {
        const user = result.user;
        console.log("Logged in successfully via redirect as:", user.displayName);
        localStorage.setItem('praana_userId', user.uid);
        localStorage.setItem('praana_userName', user.displayName);
        navigate('/onboarding');
      }
    }).catch((error) => {
      console.error("Redirect login failed:", error);
      alert("Login failed: " + error.message);
    });
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/onboarding');
  };

  const handleGoogleLogin = async () => {
    // Mobile browsers often block popups, so we use Redirect for mobile and Popup for desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // This will redirect the page to Google, and come back to this page triggering the useEffect above
      signInWithRedirect(auth, googleProvider);
    } else {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log("Logged in successfully as:", user.displayName);
        
        localStorage.setItem('praana_userId', user.uid);
        localStorage.setItem('praana_userName', user.displayName);
        navigate('/onboarding');
      } catch (error) {
        console.error("Google login failed:", error.message);
        alert("Failed to login with Google: " + error.message);
      }
    }
  };

  return (
    <div className="auth-page">
      {/* Sidebar for Desktop */}
      <div className="auth-sidebar">
        <svg width="64" height="64" viewBox="0 0 28 28" fill="none" style={{ marginBottom: '24px' }}>
          <circle cx="18" cy="8" r="7" stroke="white" strokeWidth="2.2"/>
          <circle cx="8" cy="18" r="5" stroke="white" strokeWidth="2"/>
          <circle cx="21" cy="21" r="3" stroke="white" strokeWidth="1.8"/>
        </svg>
        <h2 style={{ fontSize: '32px', fontWeight: '500', marginBottom: '16px', fontFamily: "'Sora', sans-serif" }}>Welcome back.</h2>
        <p style={{ fontSize: '18px', opacity: 0.8, maxWidth: '300px', lineHeight: 1.5 }}>
          Take a deep breath. Your conscious space awaits you.
        </p>
      </div>

      {/* Form Container */}
      <div className="auth-form-container">
        
        <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '20px' }}>
          <div style={{ width: '60px', height: '60px', margin: '0 auto 16px auto', borderRadius: '16px', backgroundColor: 'var(--color-bg-card)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* Logo icon */}
            <div style={{ position: 'relative', width: '32px', height: '32px' }}>
              <div style={{ position: 'absolute', top: '2px', right: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
              <div style={{ position: 'absolute', top: '12px', left: '2px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
              <div style={{ position: 'absolute', bottom: '2px', right: '12px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
            </div>
          </div>
          <h1>Praana</h1>
          <p className="subtitle" style={{ fontStyle: 'normal' }}>Return to your center.</p>
        </div>

        <div className="auth-card">
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <input type="email" placeholder="name@example.com" required />
                <Mail className="input-icon" size={18} />
              </div>
            </div>

            <div className="input-group">
              <label>
                <span>Password</span>
                <Link to="/forgot-password" style={{ color: 'var(--color-primary)', fontWeight: '500', cursor: 'pointer', textDecoration: 'none' }}>Forgot?</Link>
              </label>
              <div className="input-wrapper">
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" required />
                <div className="input-icon" style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-4">
              Enter Space
            </button>
          </form>

          <div className="divider">or continue with</div>

          <button onClick={handleGoogleLogin} type="button" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', backgroundColor: '#fcfdfa' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="footer-link" style={{ marginTop: 'auto', paddingBottom: '20px' }}>
          New to the breath? <Link to="/signup">Create an Account</Link>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', letterSpacing: '1px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
          PRESENCE THROUGH FOCUS
        </div>
      </div>
    </div>
  );
}
