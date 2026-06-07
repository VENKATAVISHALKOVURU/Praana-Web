import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../firebase.js';
import { useTranslation } from 'react-i18next';

// Removed DashboardBreathingOrb

export default function Home() {
  const { t } = useTranslation();
  const [timeOfDay, setTimeOfDay] = useState('evening');
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('P');
  const [userPhoto, setUserPhoto] = useState(null);
  const [currentDate, setCurrentDate] = useState('Today');
  const [insightIndex, setInsightIndex] = useState(0);
  const [activeParticipants, setActiveParticipants] = useState(0);
  
  // Breathing Exercise State
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingTimeLeft, setBreathingTimeLeft] = useState(120); // 2 minutes
  const [breathingInterval, setBreathingInterval] = useState(null);

  const startBreathing = () => {
    setBreathingActive(true);
    setBreathingTimeLeft(120);
    const interval = setInterval(() => {
      setBreathingTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setBreathingActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setBreathingInterval(interval);
  };

  const stopBreathing = () => {
    if (breathingInterval) clearInterval(breathingInterval);
    setBreathingActive(false);
    setBreathingTimeLeft(0);
  };

  const extendBreathing = () => {
    setBreathingTimeLeft((prev) => prev + 60); // Add 1 minute
  };

  useEffect(() => {
    return () => {
      if (breathingInterval) clearInterval(breathingInterval);
    };
  }, [breathingInterval]);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('morning');
    } else if (hour >= 12 && hour < 17) {
      setTimeOfDay('afternoon');
    } else {
      setTimeOfDay('evening');
    }

    // Set dynamic date
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const today = new Date();
    setCurrentDate(today.toLocaleDateString('en-US', options));

    // Set dynamic insight based on day
    const insightsCount = 6;
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    setInsightIndex(dayOfYear % insightsCount);

    // Listen to Firebase auth and get real user data
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Set photo
        setUserPhoto(user.photoURL || null);

        // Set name: prefer displayName, fallback to email prefix
        const name = user.displayName || user.email?.split('@')[0] || 'Friend';
        const firstName = name.split(' ')[0];
        setUserName(firstName);

        // Build initials (up to 2 letters)
        const parts = name.trim().split(' ').filter(Boolean);
        const initials = parts.length >= 2
          ? parts[0][0] + parts[1][0]
          : parts[0]?.slice(0, 2) || 'P';
        setUserInitials(initials.toUpperCase());

        // Also keep localStorage in sync
        localStorage.setItem('praana_userName', name);
      } else {
        // Fallback to localStorage if auth not ready yet
        const storedName = localStorage.getItem('praana_userName') || 'Friend';
        const firstName = storedName.split(' ')[0];
        setUserName(firstName);
        setUserInitials(firstName.slice(0, 2).toUpperCase());
      }
    });

    // Listen to active rooms
    const roomRef = ref(rtdb, 'rooms/global/participants');
    const unsubscribeRooms = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setActiveParticipants(Object.keys(data).length);
      } else {
        setActiveParticipants(0);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeRooms();
    };
  }, []);

  return (
    <div className="min-h-full pb-12 relative z-10">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#f8f7f2]/80 backdrop-blur-xl border-b border-border-dusty/10 flex justify-between items-center w-full px-6 py-4 md:px-12 md:py-6 shadow-[0_4px_32px_rgba(0,0,0,0.02)] transition-all">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-headline-md text-xl md:text-2xl text-primary tracking-tight font-semibold">
              {timeOfDay === 'morning' ? t('home.goodMorning') : timeOfDay === 'afternoon' ? t('home.goodAfternoon') : t('home.goodEvening')}
              {userName ? `, ${userName}` : ''}
            </span>
          </div>
          <span className="font-label-sm text-xs md:text-sm text-on-surface-variant/80 italic font-medium">{t('home.awarenessSubtitle')}</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={startBreathing} className="w-10 h-10 rounded-full bg-surface-mint flex items-center justify-center text-primary hover:shadow-md transition-all duration-300">
            <span className="material-symbols-outlined text-[20px]">hourglass_empty</span>
          </button>
          <Link to="/saathi" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-on-surface-variant hover:text-primary hover:shadow-md transition-all duration-300">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </Link>
          <Link to="/profile" className="w-11 h-11 rounded-full border-2 border-surface-herbal shadow-sm hover:shadow-md transition-all duration-300 block relative group overflow-hidden">
            {userPhoto ? (
              <img
                alt="User avatar"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                src={userPhoto}
                referrerPolicy="no-referrer"
                onError={() => setUserPhoto(null)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1a3b2b] to-[#2d5a3d] flex items-center justify-center">
                <span className="text-white text-sm font-bold tracking-wide">{userInitials}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
          </Link>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 flex flex-col gap-6">
        
        {/* ROW 1: Hero & Saathi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 stagger-fade-in" style={{ animationDelay: '0.1s' }}>
          
          {/* Hero Section */}
          <div className="lg:col-span-8 relative overflow-hidden rounded-3xl bg-primary-container p-6 md:p-10 shadow-[0_12px_24px_-12px_rgba(13,46,25,0.4)] animate-breathing group flex flex-col justify-between min-h-[240px]">
            <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-1000 pointer-events-none">
              <img alt="Abstract painting" className="w-full h-full object-cover mix-blend-overlay scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo-DtvVeKkOkw0gOx5eLkztNkThjoxb4Q9w4X2Hn1EhkZy4JP2O_FG0l4uCRjsUlAVYYw6H3Dhd16d5PGvVPgKWxcF-vAs_t9BlgYZR7h_fNqyvjS2n-fVHGlE-zluLMo3IeuNBVDk8ebzvFsXgUAM81RcsjZXXV5Q29BXQNK62oSQwQz1x6ES01QXXL6GRmYMFOF1dvpH9WACSmqVW41f252CdC2OA4RSNuH8L1sFTwwmsaDOVA9kln2x-mVsWWGcnDFicYJ5DD8" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
            
            <div className="relative z-10 flex justify-between items-start mb-12">
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-surface-mint animate-pulse"></span>
                <span className="font-label-sm text-[10px] font-bold uppercase tracking-[0.15em] text-surface-mint">{t('home.mainInsight')}</span>
              </div>
              <span className="font-label-sm text-xs font-bold text-white/90 tracking-widest uppercase bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {currentDate}
              </span>
            </div>

            <div className="relative z-10">
              <h1 className="text-white max-w-[95%] md:max-w-[85%] font-headline-md text-3xl md:text-4xl lg:text-5xl leading-[1.15] font-medium tracking-tight drop-shadow-md">
                {t('home.insights', { returnObjects: true })[insightIndex]}
              </h1>
            </div>
          </div>

          {/* Saathi AI Interface */}
          <div className="lg:col-span-4 bg-gradient-to-br from-primary-container to-[#1a3821] rounded-3xl p-6 md:p-8 flex flex-col justify-between items-center text-center relative overflow-hidden shadow-[0_12px_24px_-12px_rgba(13,46,25,0.3)] group min-h-[240px]">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50"></div>
            
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-surface-mint mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg relative z-10">
              <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            </div>
            
            <div className="space-y-1.5 z-10 mb-6 w-full">
              <h3 className="font-semibold text-xl text-white tracking-tight">{t('home.saathiMirror')}</h3>
              <p className="text-sm font-medium text-surface-mint/80 leading-relaxed px-4">{t('home.saathiQuote')}</p>
            </div>
            
            <Link to="/saathi" className="w-full bg-surface-mint text-primary py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98] shadow-md z-10 block text-center mt-auto">
              {t('home.reflectBtn')}
            </Link>
          </div>
        </div>

        {/* ROW 2: Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 stagger-fade-in" style={{ animationDelay: '0.2s' }}>
          
          {/* Streak Card */}
          <div className="lg:col-span-3 bg-white p-6 rounded-3xl flex flex-col justify-between min-h-[160px] shadow-sm border border-border-dusty/30 hover:border-border-dusty/60 hover:shadow-md transition-all duration-300 group cursor-default">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-surface-mint transition-colors duration-300">
                <span className="material-symbols-outlined text-xl">nightlight</span>
              </div>
              <span className="uppercase text-[10px] font-bold tracking-widest text-outline">{t('home.streak')}</span>
            </div>
            <div className="mt-6">
              <span className="block text-4xl font-display-lg text-primary tracking-tight font-semibold">12 Days</span>
              <span className="text-sm font-medium text-on-surface-variant mt-1 block">{t('home.consciousEvenings')}</span>
            </div>
          </div>

          {/* Completed Sessions Card */}
          <Link to="/rooms" className="lg:col-span-3 bg-white p-6 rounded-3xl flex flex-col justify-between min-h-[160px] shadow-sm border border-border-dusty/30 hover:border-border-dusty/60 hover:shadow-md transition-all duration-300 group cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-surface-mint/20 rounded-full blur-xl -translate-y-10 translate-x-10 pointer-events-none"></div>
            <div className="flex justify-between items-start relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-surface-mint transition-colors duration-300">
                <span className="material-symbols-outlined text-xl">group_work</span>
              </div>
              <span className="uppercase text-[10px] font-bold tracking-widest text-outline flex items-center gap-1">
                {activeParticipants > 0 ? <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> : null}
                {t('home.rooms')}
              </span>
            </div>
            <div className="mt-6 relative z-10">
              <span className="block text-4xl font-display-lg text-primary tracking-tight font-semibold">{activeParticipants}</span>
              <span className="text-sm font-medium text-on-surface-variant mt-1 block">{t('home.activeSouls')}</span>
            </div>
          </Link>

          {/* Awareness Heatmap Card */}
          <div className="sm:col-span-2 lg:col-span-6 bg-white p-6 rounded-3xl shadow-sm border border-border-dusty/30 hover:border-border-dusty/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col gap-1">
                <span className="uppercase text-[10px] tracking-widest text-outline font-bold">{t('home.awarenessRhythm')}</span>
                <span className="font-display text-xl text-primary font-semibold tracking-tight">{t('home.weeklyFlow')}</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">calendar_today</span>
              </div>
            </div>
            <div className="flex justify-between items-center gap-2 lg:gap-4 mt-auto">
              {t('home.days', { returnObjects: true }).map((day, idx) => (
                <div key={day} className="flex flex-col items-center gap-2.5 flex-1 group cursor-pointer">
                  <span className={`uppercase font-bold text-[10px] md:text-[11px] transition-colors ${idx === 3 ? 'text-primary' : 'text-outline group-hover:text-on-surface-variant'}`}>{day}</span>
                  <div className={`w-full max-w-[48px] aspect-square rounded-xl md:rounded-2xl flex items-center justify-center relative transition-all duration-300
                    ${idx === 1 || idx === 2 ? 'bg-surface-mint shadow-inner' : idx === 3 ? 'border-2 border-primary bg-white shadow-sm scale-110' : 'bg-surface-container-low group-hover:bg-[#ebe9dd]'}`}>
                    {idx === 1 || idx === 2 ? <span className="material-symbols-outlined text-sm text-primary">circle</span> : null}
                    {idx === 3 ? <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div> : null}
                    {idx === 0 ? <div className="w-2 h-2 rounded-full bg-border-dusty/40"></div> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 3: Charts & Deep Work */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 stagger-fade-in" style={{ animationDelay: '0.3s' }}>
          
          {/* Screen Time vs Focus Time */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-border-dusty/30 hover:border-border-dusty/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[260px]">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-primary">{t('home.focusVsDistraction')}</h2>
                <p className="text-xs text-on-surface-variant font-medium mt-1">{t('home.todaysBalance')}</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-outline bg-surface-container-low px-3 py-1.5 rounded-lg">{t('home.today')}</span>
            </div>
            
            <div className="space-y-6 mt-auto">
              <div className="space-y-2 group">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface font-semibold group-hover:text-primary transition-colors">{t('home.screenTime')}</span>
                  <span className="text-on-surface-variant text-xs font-bold bg-surface-container-low px-2 py-0.5 rounded-md">2h 45m</span>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden shadow-inner relative">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-1000 ease-out" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div className="space-y-2 group">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface font-semibold group-hover:text-primary transition-colors">{t('home.focusRooms')}</span>
                  <span className="text-on-surface-variant text-xs font-bold bg-surface-container-low px-2 py-0.5 rounded-md">1h 15m</span>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden shadow-inner relative">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#9bcf8a] to-surface-herbal rounded-full transition-all duration-1000 ease-out delay-300" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Apps Today Section */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-border-dusty/30 hover:border-border-dusty/60 hover:shadow-md transition-all duration-300 flex flex-col min-h-[260px]">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold tracking-tight text-primary">{t('home.topApps')}</h2>
            </div>
            
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-surface-container-low transition-colors group cursor-default border border-transparent hover:border-border-dusty/20">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-orange-400 flex items-center justify-center shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-white text-[18px]">photo_camera</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors truncate">Instagram</h4>
                </div>
                <span className="font-bold text-sm text-primary font-display shrink-0">1h 42m</span>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-surface-container-low transition-colors group cursor-default border border-transparent hover:border-border-dusty/20">
                <div className="w-10 h-10 rounded-xl bg-[#1DA1F2] flex items-center justify-center shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-white text-[18px]">flutter_dash</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors truncate">Twitter (X)</h4>
                </div>
                <span className="font-bold text-sm text-primary font-display shrink-0">45m</span>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-surface-container-low transition-colors group cursor-default border border-transparent hover:border-border-dusty/20">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-white text-[18px]">play_arrow</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors truncate">YouTube</h4>
                </div>
                <span className="font-bold text-sm text-primary font-display shrink-0">30m</span>
              </div>
            </div>
          </div>
          
          {/* Removed Breathing Regulation Card since it is now at the top */}
        </div>
      </main>
      
      {/* Full-Screen Breathing Overlay */}
      {breathingActive && (
        <div className="fixed inset-0 z-50 bg-[#1a3821]/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="absolute top-8 right-8 z-20 flex gap-4">
            <button 
              onClick={extendBreathing}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-2xl font-bold text-sm backdrop-blur-md transition-colors flex items-center gap-2 border border-white/20"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              1 Min
            </button>
            <button 
              onClick={stopBreathing}
              className="bg-white hover:bg-gray-100 text-primary px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
              Stop
            </button>
          </div>

          <style>{`
            @keyframes breathe-circle-full {
              0%, 10% { transform: scale(0.6); opacity: 0.3; }
              30%, 40% { transform: scale(1.4); opacity: 0.8; }
              60%, 70% { transform: scale(0.6); opacity: 0.3; }
              100% { transform: scale(0.6); opacity: 0.3; }
            }
            @keyframes breathe-text-full {
              0%, 10% { opacity: 0; transform: translateY(10px); }
              20%, 35% { opacity: 1; transform: translateY(0); content: "Inhale"; }
              45%, 55% { opacity: 0; transform: translateY(-10px); }
              65%, 80% { opacity: 1; transform: translateY(0); content: "Exhale"; }
              90%, 100% { opacity: 0; transform: translateY(10px); }
            }
            .breathing-orb-full {
              animation: breathe-circle-full 8s infinite ease-in-out;
            }
            .inhale-exhale-text-full::after {
              content: "Breathe";
              animation: breathe-text-full 8s infinite ease-in-out;
            }
          `}</style>
          
          <div className="relative w-64 h-64 flex items-center justify-center z-10 mb-12">
            <div className="absolute inset-0 bg-surface-mint rounded-full blur-3xl opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-surface-mint to-[#e6f4e1] rounded-full breathing-orb-full shadow-[0_0_80px_rgba(195,229,178,0.5)]"></div>
            <div className="relative text-primary font-display text-4xl bg-white/90 backdrop-blur-md w-32 h-32 rounded-full flex items-center justify-center shadow-inner font-bold tracking-tight">
              {Math.floor(breathingTimeLeft / 60)}:{(breathingTimeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>

          <div className="inhale-exhale-text-full font-display-lg text-5xl text-surface-mint tracking-tight font-semibold drop-shadow-md z-10 h-12 flex items-center justify-center"></div>
        </div>
      )}
    </div>
  );
}
