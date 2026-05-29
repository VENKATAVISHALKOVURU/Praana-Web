import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate signup process
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/'); // Next step would be onboarding, but routing to splash for now
    }, 1500);
  };

  return (
    <div className="signup-container">
      {/* Premium Background Ornamentation */}
      <div className="ambient-background">
        <div className="ambient-orb mint-orb"></div>
        <div className="ambient-orb herbal-orb"></div>
      </div>

      {/* Main Container */}
      <main className="signup-main">
        {/* Brand Identity / Logo */}
        <div className="brand-identity">
          <span className="material-symbols-outlined logo-icon-large">bubble_chart</span>
          <h1 className="brand-title">Praana</h1>
        </div>

        {/* Hero Visual Section */}
        <div className="hero-visual">
          <img 
            alt="Conscious Beginnings" 
            className="hero-image" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8jxe9kfi8aLf9DCJVGBxGCL2xSXWvKZy7JZDYJJ9DQjqZ4PgzJQ7UaRH1HBElJXOPDIrX7ZdCz31knLJzmRNfyNbBEah3HN4lWwV756qKfgO2jEjoyz5-TxpLzNyP8M_Yj8fzF2bh4bNPx7sUCG23PaJd2WAcTjkYKu4DR05IUdn-YtGcIB-DOJEhOKphRZJoRlwp8ufqmbDbuwdCoEYwyH2rS59oYYdRj71iwglYuC5TNp4jgoUpIGXEhjVstpfXZmDvBkh3KgA" 
          />
          <div className="hero-overlay"></div>
        </div>

        {/* Welcome Text */}
        <div className="welcome-text">
          <h2 className="welcome-heading">Begin your journey</h2>
          <p className="welcome-subtext">This space adapts gently to you.</p>
        </div>

        {/* Signup Form */}
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Full Name Field */}
          <div className="input-group">
            <label htmlFor="name" className="input-label">Full Name</label>
            <div className="input-wrapper">
              <input 
                id="name" 
                type="text" 
                placeholder="Elias Thorne" 
                required 
                className="form-input" 
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email Address</label>
            <div className="input-wrapper">
              <input 
                id="email" 
                type="email" 
                placeholder="hello@praana.co" 
                required 
                className="form-input" 
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="input-group">
            <label htmlFor="password" className="input-label">Create Password</label>
            <div className="input-wrapper">
              <input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required 
                className="form-input" 
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Primary Action */}
          <div className="form-actions">
            <button 
              type="submit" 
              className={`btn-primary ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                'Continue'
              )}
            </button>
          </div>

          {/* Google Auth */}
          <div className="google-auth">
            <button type="button" className="btn-google">
              <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </form>

        {/* Footer / Secondary Actions */}
        <footer className="signup-footer">
          <p className="login-prompt">
            Already have an account? <Link to="/login" className="login-link">Log in</Link>
          </p>
          <div className="editorial-divider">
            <span className="divider-line"></span>
            <span className="divider-text">Editorial Precision</span>
            <span className="divider-line"></span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Signup;
