import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from '../firebase';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/onboarding');
    }, 1500);
  };

  const handleGoogleLogin = async () => {
    try {
      const isMobile = window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Use redirect exclusively on mobile to prevent popup blocking and cross-site tracking issues
        await signInWithRedirect(auth, googleProvider);
      } else {
        // Use popup on desktop
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        localStorage.setItem('praana_userId', user.uid);
        localStorage.setItem('praana_userName', user.displayName);
        navigate('/onboarding');
      }
    } catch (error) {
      console.error("Google Popup login failed:", error);
      
      // Fallback just in case
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        alert("Popup was blocked. Redirecting instead...");
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectErr) {
          alert("Redirect login failed: " + redirectErr.message);
        }
      } else {
        alert(`Google Login Error (${error.code}): ${error.message}`);
      }
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col items-center justify-center selection:bg-surface-herbal overflow-hidden relative">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-surface-herbal/20 rounded-full blur-[100px] animate-breath"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-secondary-container/10 rounded-full blur-[80px] animate-breath" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Login Container */}
      <main className="w-full max-w-[420px] px-6 relative z-10 flex flex-col items-center">
        {/* Identity Header */}
        <header className="mb-8 flex flex-col items-center">
          <div className="bg-surface-mint p-4 rounded-xl mb-4 shadow-[0_10px_40px_-10px_rgba(90,91,44,0.1)]">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: '"FILL" 1' }}>bubble_chart</span>
          </div>
          <h1 className="font-headline-md text-3xl text-primary tracking-tight font-medium">Praana</h1>
          <p className="font-label-md text-sm text-on-surface-variant mt-1">Return to your center.</p>
        </header>

        {/* Form Card */}
        <section className="bg-surface-mint w-full p-8 rounded-2xl shadow-[0_10px_40px_-10px_rgba(90,91,44,0.1)] flex flex-col gap-6 border border-border-dusty/30">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-xs font-semibold text-on-surface-variant px-2" htmlFor="email">Email Address</label>
              <div className="relative group">
                <input 
                  className="w-full bg-surface/50 border border-border-dusty rounded-xl px-4 py-3 font-body-md text-base text-on-surface focus:ring-0 focus:border-primary-container transition-all duration-300 placeholder:text-outline/50 group-focus-within:scale-[1.01]" 
                  id="email" 
                  placeholder="name@example.com" 
                  type="email" 
                  required
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline/40">mail</span>
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center px-2">
                <label className="font-label-sm text-xs font-semibold text-on-surface-variant" htmlFor="password">Password</label>
                <Link to="/forgot-password" className="font-label-sm text-xs font-semibold text-secondary hover:text-primary transition-colors">Forgot?</Link>
              </div>
              <div className="relative group">
                <input 
                  className="w-full bg-surface/50 border border-border-dusty rounded-xl px-4 py-3 font-body-md text-base text-on-surface focus:ring-0 focus:border-primary-container transition-all duration-300 placeholder:text-outline/50 group-focus-within:scale-[1.01]" 
                  id="password" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"} 
                  required
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/40 hover:text-on-surface-variant transition-colors" 
                  type="button"
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button 
              className={`mt-2 bg-primary text-surface-mint font-semibold text-base py-3.5 rounded-xl transition-all shadow-[0_10px_40px_-10px_rgba(90,91,44,0.1)] flex justify-center items-center ${isLoading ? 'opacity-80' : 'hover:bg-primary-container active:scale-[0.98]'}`} 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Enter Space'}
            </button>
          </form>

          <div className="relative py-1 flex items-center">
            <div className="flex-grow border-t border-border-dusty/30"></div>
            <span className="flex-shrink mx-4 font-label-sm text-xs font-semibold text-outline/50 uppercase tracking-wider">or continue with</span>
            <div className="flex-grow border-t border-border-dusty/30"></div>
          </div>

          {/* Google Login */}
          <button onClick={handleGoogleLogin} type="button" className="w-full flex items-center justify-center gap-2 bg-surface-container-low border border-border-dusty/20 py-3.5 rounded-xl font-semibold text-sm text-on-surface hover:bg-surface-container-high transition-colors active:scale-[0.98]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg> 
            Continue with Google
          </button>
        </section>

        {/* Footer Navigation */}
        <footer className="mt-8 text-center">
          <p className="font-body-md text-base text-on-surface-variant">
            New to the breath? 
            <Link to="/signup" className="text-primary font-semibold hover:underline decoration-surface-herbal decoration-2 underline-offset-4 ml-1">Create an Account</Link>
          </p>
        </footer>
      </main>

      {/* Decorative Illustration */}
      <div className="mt-8 opacity-30 select-none pointer-events-none md:fixed md:bottom-12 md:right-12 md:mt-0 md:opacity-20">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-surface-herbal to-secondary-container blur-xl animate-breath"></div>
          <p className="font-label-sm text-[10px] tracking-widest font-semibold text-secondary mt-2 uppercase opacity-40">Presence through focus</p>
        </div>
      </div>
      
      <style>{`
        @keyframes subtle-breath {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.02); opacity: 1; }
        }
        .animate-breath {
          animation: subtle-breath 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
