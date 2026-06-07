import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      localStorage.setItem('praana_userId', userCredential.user.uid);
      localStorage.setItem('praana_userName', name);
      
      setIsLoading(false);
      navigate('/onboarding');
    } catch (error) {
      console.error("Signup failed:", error);
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Use popup for all devices to prevent redirect loops on iOS Safari
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      localStorage.setItem('praana_userId', user.uid);
      localStorage.setItem('praana_userName', user.displayName);
      navigate('/onboarding');
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
    <div className="min-h-screen flex flex-col items-center justify-center font-body-md text-body-md overflow-x-hidden bg-background text-on-surface">
      {/* Premium Background Ornamentation */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-surface-mint rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-surface-herbal rounded-full blur-[100px] opacity-30"></div>
      </div>
      
      {/* Main Container */}
      <main className="relative z-10 w-full max-w-[420px] px-6 py-8 flex flex-col items-center">
        {/* Brand Identity / Logo */}
        <div className="mb-8 flex flex-col items-center space-y-2">
          <span className="material-symbols-outlined text-primary text-[48px] opacity-90" style={{ fontVariationSettings: '"FILL" 1' }}>bubble_chart</span>
          <h1 className="font-headline-md text-3xl text-primary tracking-tight font-medium">Praana</h1>
        </div>
        
        {/* Hero Visual Section */}
        <div className="w-full mb-8 rounded-2xl overflow-hidden shadow-[0_10px_30px_-5px_rgba(90,91,44,0.1)] bg-surface-mint aspect-video relative">
          <img 
            alt="Conscious Beginnings" 
            className="w-full h-full object-cover mix-blend-multiply opacity-80" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8jxe9kfi8aLf9DCJVGBxGCL2xSXWvKZy7JZDYJJ9DQjqZ4PgzJQ7UaRH1HBElJXOPDIrX7ZdCz31knLJzmRNfyNbBEah3HN4lWwV756qKfgO2jEjoyz5-TxpLzNyP8M_Yj8fzF2bh4bNPx7sUCG23PaJd2WAcTjkYKu4DR05IUdn-YtGcIB-DOJEhOKphRZJoRlwp8ufqmbDbuwdCoEYwyH2rS59oYYdRj71iwglYuC5TNp4jgoUpIGXEhjVstpfXZmDvBkh3KgA" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-mint/80 to-transparent"></div>
        </div>
        
        {/* Welcome Text */}
        <div className="text-center mb-6 space-y-1">
          <h2 className="font-headline-lg-mobile text-2xl text-on-surface font-semibold">Begin your journey</h2>
          <p className="font-body-md text-on-surface-variant italic">This space adapts gently to you.</p>
        </div>
        
        {/* Signup Form */}
        <form onSubmit={handleSignup} className="w-full space-y-4">
          {/* Full Name Field */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-label-md text-sm font-medium text-on-surface-variant ml-2" htmlFor="name">Full Name</label>
            <div className="relative group">
              <input 
                className="w-full bg-surface-container-low border border-border-dusty rounded-xl px-4 py-3 font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-surface-tint focus:bg-white transition-all duration-300 group-focus-within:translate-y-[-2px]" 
                id="name" 
                placeholder="Elias Thorne" 
                required 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          
          {/* Email Field */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-label-md text-sm font-medium text-on-surface-variant ml-2" htmlFor="email">Email Address</label>
            <div className="relative group">
              <input 
                className="w-full bg-surface-container-low border border-border-dusty rounded-xl px-4 py-3 font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-surface-tint focus:bg-white transition-all duration-300 group-focus-within:translate-y-[-2px]" 
                id="email" 
                placeholder="hello@praana.co" 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          {/* Password Field */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-label-md text-sm font-medium text-on-surface-variant ml-2" htmlFor="password">Create Password</label>
            <div className="relative group">
              <input 
                className="w-full bg-surface-container-low border border-border-dusty rounded-xl px-4 py-3 font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-surface-tint focus:bg-white transition-all duration-300 group-focus-within:translate-y-[-2px]" 
                id="password" 
                placeholder="••••••••" 
                required 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60 hover:opacity-100 transition-opacity" 
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>
          
          {/* Error Message */}
          {errorMsg && (
            <div className="text-red-500 text-sm font-medium text-center mt-2">
              {errorMsg}
            </div>
          )}

          {/* Primary Action */}
          <div className="pt-2">
            <button 
              className={`w-full bg-primary text-surface-mint font-semibold text-lg py-3.5 rounded-xl shadow-[0_10px_30px_-5px_rgba(90,91,44,0.1)] active:scale-[0.98] transition-all duration-200 hover:bg-primary-container flex justify-center items-center ${isLoading ? 'opacity-80' : ''}`} 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Continue'}
            </button>
          </div>
          
          <div className="pt-4">
            <button 
              onClick={handleGoogleLogin} 
              className="w-full flex items-center justify-center space-x-2 bg-surface-container-low border border-border-dusty/20 text-on-surface font-semibold text-sm py-3.5 rounded-xl hover:bg-surface-container-high transition-colors duration-200 active:scale-[0.98]" 
              type="button"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
        <div className="mt-8 text-center space-y-4">
          <p className="font-label-md text-sm text-on-surface-variant font-medium">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
          </p>
          <div className="flex items-center justify-center space-x-2 pt-4">
            <span className="h-[1px] w-8 bg-border-dusty"></span>
            <span className="font-label-sm text-xs font-semibold text-outline tracking-widest uppercase">Editorial Precision</span>
            <span className="h-[1px] w-8 bg-border-dusty"></span>
          </div>
        </div>
      </main>
    </div>
  );
}
